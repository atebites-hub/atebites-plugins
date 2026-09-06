#!/usr/bin/env python3
"""factory-policy v1 memory checkers (C3.1, C3.2, C3.3, C5, C6; C7 stub).

SoT: factory-01-policy-layer.md, policy-gate.md, Build Sheet §5.
Do not invent C4. C7 is warned-not-implemented (never a fail-mode block).

Exit codes (policy-gate.md §2.1):
    0  pass, or warn-only findings
    1  fail-mode violation (Fix: lines on stderr)
    2  usage
    3  environment (unreadable config, etc.)
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import re
import shlex
import shutil
import sys
import tomllib
from collections.abc import Sequence
from pathlib import Path

EXIT_OK = 0
EXIT_VIOLATION = 1
EXIT_USAGE = 2
EXIT_ENV = 3

CHECK_IDS = ("C3.1", "C3.2", "C3.3", "C5", "C6", "C7")
CHECK_NAMES = {
    "C3.1": "doc-cited",
    "C3.2": "scope-literal",
    "C3.3": "plan-filled",
    "C5": "gate-runnable",
    "C6": "issue-linked",
    "C7": "plan-approved",
}
VALID_MODES = ("warn", "fail", "off")
DEFAULT_MODES = {check_id: "warn" for check_id in CHECK_IDS}
DEFAULT_CODE_GLOBS = ("src/**",)
ALLOWED_SCOPES = ("inline", "open-dynamic-workflows")

PLUGIN_ROOT = Path(__file__).resolve().parent.parent
SHIPPED_CONFIG = PLUGIN_ROOT / "config" / "policy.toml"

_TASK_HEADING_RE = re.compile(r"^##\s+Task\s+\(TCREI\)\s*$")
_H2_RE = re.compile(r"^##\s")
_NEXT_BULLET_RE = re.compile(r"^-\s+\*\*[^*]+\*\*:")
_LONE_BRACKET_RE = re.compile(r"\[[^\]]*\]")
_DOC_CITED_RE = re.compile(r"docs/agents/[a-z_]+\.md")
_NON_VERIFIABLE_RE = re.compile(r"(?i)\bnon-verifiable\b")
_GATE_RE = re.compile(r"(?i)\bgate:\s*(.+)")
_ISSUE_URL_RE = re.compile(r"https?://[^\s)<>]+", re.IGNORECASE)
_ISSUE_HASH_RE = re.compile(r"(?<![A-Za-z0-9])#\d+\b")
_LINEAR_BULLET_RE = re.compile(
    r"(?im)^-\s+\*\*Linear\*\*:\s*[A-Z][A-Z0-9_]*-\d+\s*$"
)
_IN_PROGRESS_RE = re.compile(r"(?im)^\s*-?\s*state:\s*in_progress\s*$")
_TODO_PLAN_RE = re.compile(r"(?i)^todo\b")
_ORDERED_PLACEHOLDER_RE = re.compile(r"(?i)^\[ordered")


class Finding:
    def __init__(self, check_id: str, message: str, fix: str, mode: str) -> None:
        self.check_id = check_id
        self.message = message
        self.fix = fix
        self.mode = mode

    def __repr__(self) -> str:
        return (
            f"Finding(check_id={self.check_id!r}, message={self.message!r}, "
            f"fix={self.fix!r}, mode={self.mode!r})"
        )

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Finding):
            return NotImplemented
        return (
            self.check_id == other.check_id
            and self.message == other.message
            and self.fix == other.fix
            and self.mode == other.mode
        )

    def format_lines(self) -> list[str]:
        prefix = "WARN " if self.mode == "warn" else ""
        return [
            f"{prefix}[{self.check_id}] {self.message}",
            f"Fix: {self.fix}",
        ]


def is_filled(content: str) -> bool:
    stripped = content.strip()
    if not stripped:
        return False
    if _LONE_BRACKET_RE.fullmatch(stripped):
        return False
    return True


def _extract_block(
    lines: list[str], heading_re: re.Pattern[str], stop_re: re.Pattern[str]
) -> list[str] | None:
    start: int | None = None
    for index, line in enumerate(lines):
        if heading_re.match(line):
            start = index + 1
            break
    if start is None:
        return None
    block: list[str] = []
    for line in lines[start:]:
        if stop_re.match(line):
            break
        block.append(line)
    return block


def _find_bullet_block(block: list[str], label: str) -> str | None:
    pattern = re.compile(rf"^-\s+\*\*{re.escape(label)}\*\*:\s*(.*)$")
    collected: list[str] | None = None
    for line in block:
        if collected is None:
            match = pattern.match(line)
            if match:
                collected = [match.group(1)]
            continue
        if _NEXT_BULLET_RE.match(line) or line.startswith("#"):
            break
        collected.append(line)
    if collected is None:
        return None
    return "\n".join(collected)


def _scope_value(raw: str) -> str:
    return raw.strip().strip("`").strip()


def _is_plan_filled(raw: str) -> bool:
    stripped = raw.strip()
    if not is_filled(stripped):
        return False
    if _TODO_PLAN_RE.match(stripped):
        return False
    if _ORDERED_PLACEHOLDER_RE.match(stripped):
        return False
    return True


def _first_gate_token(gate_body: str) -> str:
    body = gate_body.strip().strip("`")
    if not body:
        return ""
    try:
        parts = shlex.split(body)
    except ValueError:
        parts = body.split()
    if not parts:
        return ""
    return parts[0]


def command_resolves(first: str, repo_root: Path) -> bool:
    if not first:
        return False
    candidate = Path(first)
    if candidate.is_absolute():
        return candidate.exists()
    relative = repo_root / first
    if relative.exists():
        return True
    return shutil.which(first) is not None


def _normalize_path(path: str) -> str:
    normalized = path.replace("\\", "/").strip()
    while normalized.startswith("./"):
        normalized = normalized[2:]
    return normalized


def _path_candidates(path: str) -> list[str]:
    parts = [
        part for part in _normalize_path(path).split("/") if part not in ("", ".")
    ]
    return ["/".join(parts[index:]) for index in range(len(parts))]


def _glob_matches(candidate: str, glob: str) -> bool:
    pattern = glob.replace("\\", "/").strip()
    if not pattern:
        return False
    if fnmatch.fnmatch(candidate, pattern):
        return True
    if pattern.endswith("/**") and candidate == pattern[:-3]:
        return True
    return False


def is_code_path(path: str, globs: Sequence[str]) -> bool:
    if not path or not globs:
        return False
    for candidate in _path_candidates(path):
        for glob in globs:
            if _glob_matches(candidate, glob):
                return True
    return False


def is_src_path(path: str) -> bool:
    return is_code_path(path, DEFAULT_CODE_GLOBS)


def is_in_progress(text: str) -> bool:
    return _IN_PROGRESS_RE.search(text) is not None


def cites_issue(text: str) -> bool:
    if _ISSUE_URL_RE.search(text):
        return True
    if _ISSUE_HASH_RE.search(text):
        return True
    if _LINEAR_BULLET_RE.search(text):
        return True
    return False


def extract_edit_path(payload: object) -> str | None:
    if not isinstance(payload, dict):
        return None
    nested_keys = ("tool_input", "toolInput", "input")
    path_keys = ("file_path", "filePath", "path", "file")
    for nested_key in nested_keys:
        nested = payload.get(nested_key)
        if isinstance(nested, dict):
            for key in path_keys:
                value = nested.get(key)
                if isinstance(value, str) and value.strip():
                    return value.strip()
    for key in ("file_path", "filePath", "file"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    value = payload.get("path")
    if isinstance(value, str) and value.strip() and "/" in value.replace("\\", "/"):
        return value.strip()
    return None


def _default_modes() -> dict[str, str]:
    return dict(DEFAULT_MODES)


def _apply_check_table(modes: dict[str, str], table: object, source: Path) -> None:
    if not isinstance(table, dict):
        raise ValueError(f"{source}: [checks] must be a table")
    for raw_key, raw_value in table.items():
        key = str(raw_key)
        if key == "C4":
            continue
        if key not in DEFAULT_MODES:
            continue
        value = str(raw_value).strip().lower()
        if value not in VALID_MODES:
            raise ValueError(
                f"{source}: checks.{key} must be warn|fail|off (got {raw_value!r})"
            )
        modes[key] = value


def _read_toml(config_path: Path) -> dict[str, object]:
    try:
        text = config_path.read_text(encoding="utf-8")
    except OSError as exc:
        raise OSError(f"cannot read config {config_path}: {exc}") from exc
    try:
        data = tomllib.loads(text)
    except tomllib.TOMLDecodeError as exc:
        raise ValueError(f"unreadable config {config_path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"unreadable config {config_path}: root must be a table")
    return data


def load_modes(config_path: Path) -> dict[str, str]:
    data = _read_toml(config_path)
    modes = _default_modes()
    if "checks" in data:
        _apply_check_table(modes, data["checks"], config_path)
    return modes


def load_code_globs(config_path: Path) -> list[str]:
    data = _read_toml(config_path)
    raw_paths = data.get("paths")
    if raw_paths is None:
        return list(DEFAULT_CODE_GLOBS)
    if not isinstance(raw_paths, dict):
        raise ValueError(f"{config_path}: [paths] must be a table")
    raw_code = raw_paths.get("code")
    if raw_code is None:
        return list(DEFAULT_CODE_GLOBS)
    if not isinstance(raw_code, list):
        raise ValueError(f"{config_path}: paths.code must be an array of globs")
    globs = [str(item).strip() for item in raw_code if str(item).strip()]
    if not globs:
        return list(DEFAULT_CODE_GLOBS)
    return globs


def resolve_config_path(repo_root: Path, explicit: str | None) -> Path:
    if explicit:
        return Path(explicit)
    env = os.environ.get("FACTORY_POLICY_CONFIG", "").strip()
    if env:
        return Path(env)
    overlay = repo_root / "config" / "factory-policy.toml"
    if overlay.is_file():
        return overlay
    return SHIPPED_CONFIG


def _finding(check_id: str, mode: str, message: str, fix: str) -> Finding:
    return Finding(check_id=check_id, message=message, fix=fix, mode=mode)


def check_memory(
    text: str, repo_root: Path, modes: dict[str, str]
) -> list[Finding]:
    findings: list[Finding] = []
    lines = text.splitlines()
    task_block = _extract_block(lines, _TASK_HEADING_RE, _H2_RE)

    mode_c31 = modes.get("C3.1", "warn")
    if mode_c31 != "off":
        if task_block is None:
            findings.append(
                _finding(
                    "C3.1",
                    mode_c31,
                    "Context is missing because '## Task (TCREI)' is absent",
                    "add ## Task (TCREI) and cite docs/agents/<name>.md in Context",
                )
            )
        else:
            context = _find_bullet_block(task_block, "Context")
            cited = _DOC_CITED_RE.findall(context or "")
            existing = [
                path
                for path in cited
                if (repo_root / path).is_file()
            ]
            if not existing:
                findings.append(
                    _finding(
                        "C3.1",
                        mode_c31,
                        "Context must cite ≥1 on-disk path matching docs/agents/[a-z_]+.md",
                        "add a real consumer path such as docs/agents/coding_standards.md to `- **Context**:`",
                    )
                )

    mode_c32 = modes.get("C3.2", "warn")
    if mode_c32 != "off":
        if task_block is None:
            findings.append(
                _finding(
                    "C3.2",
                    mode_c32,
                    "Scope is missing because '## Task (TCREI)' is absent",
                    "add ## Task (TCREI) and set `- **Scope**: inline` or `open-dynamic-workflows`",
                )
            )
        else:
            scope_raw = _find_bullet_block(task_block, "Scope")
            scope = _scope_value(scope_raw.splitlines()[0]) if scope_raw else ""
            if scope not in ALLOWED_SCOPES:
                findings.append(
                    _finding(
                        "C3.2",
                        mode_c32,
                        "Scope must be exactly inline or open-dynamic-workflows",
                        "set `- **Scope**: inline` or `- **Scope**: open-dynamic-workflows`",
                    )
                )

    mode_c33 = modes.get("C3.3", "warn")
    if mode_c33 != "off":
        if task_block is None:
            findings.append(
                _finding(
                    "C3.3",
                    mode_c33,
                    "Plan is missing because '## Task (TCREI)' is absent",
                    "add ## Task (TCREI) and fill `- **Plan**:` with ordered steps",
                )
            )
        else:
            plan = _find_bullet_block(task_block, "Plan")
            if plan is None or not _is_plan_filled(plan):
                findings.append(
                    _finding(
                        "C3.3",
                        mode_c33,
                        "Plan must be non-placeholder (not empty / TODO / [Ordered…])",
                        "replace the Plan placeholder with ordered implementation steps",
                    )
                )

    mode_c5 = modes.get("C5", "warn")
    if mode_c5 != "off":
        if task_block is None:
            findings.append(
                _finding(
                    "C5",
                    mode_c5,
                    "Evaluation is missing because '## Task (TCREI)' is absent",
                    "add ## Task (TCREI) and a runnable `Gate: <command>` for verifiable tasks",
                )
            )
        else:
            evaluation = _find_bullet_block(task_block, "Evaluation") or ""
            if not _NON_VERIFIABLE_RE.search(evaluation):
                gate_match = _GATE_RE.search(evaluation)
                gate_body = gate_match.group(1) if gate_match else ""
                first = _first_gate_token(gate_body)
                if not gate_match or not command_resolves(first, repo_root):
                    findings.append(
                        _finding(
                            "C5",
                            mode_c5,
                            "verifiable tasks need Gate: <command> whose first token is on PATH or a repo-relative file",
                            "add `Gate: <command>` under Evaluation (command -v or an existing repo file)",
                        )
                    )

    mode_c6 = modes.get("C6", "warn")
    if mode_c6 != "off" and not cites_issue(text):
        findings.append(
            _finding(
                "C6",
                mode_c6,
                "memory must cite a tracker issue",
                "cite a URL, #N, Closes #N, or `- **Linear**: KEY-123`",
            )
        )

    mode_c7 = modes.get("C7", "warn")
    if mode_c7 == "fail":
        findings.append(
            _finding(
                "C7",
                "warn",
                "plan-approved is not implemented in v1; fail mode ignored",
                "leave C7 on warn/off until the Approved-by git-history check ships",
            )
        )

    return findings


def list_in_progress(repo_root: Path) -> list[Path]:
    memory_dir = repo_root / "docs" / "memories"
    if not memory_dir.is_dir():
        return []
    found: list[Path] = []
    for path in sorted(memory_dir.glob("*.md")):
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        if is_in_progress(text):
            found.append(path)
    return found


def emit_findings(findings: list[Finding]) -> None:
    for finding in findings:
        for line in finding.format_lines():
            print(line, file=sys.stderr)


def missing_memory_finding(modes: dict[str, str]) -> Finding:
    named = ("C3.1", "C3.2", "C3.3", "C5", "C6")
    severity = "fail" if any(modes.get(check_id) == "fail" for check_id in named) else "warn"
    return Finding(
        check_id="gate",
        message="no in_progress memory under docs/memories/ while code paths are in play",
        fix="create docs/memories/YYYY-MM-DD-<slug>.md from the memory-system template and set state: in_progress",
        mode=severity,
    )


def _print_usage() -> None:
    print(
        "usage: check_memory_policy.py [--repo-root DIR] [--config PATH] "
        "<memory.md> [memory.md ...]\n"
        "       check_memory_policy.py extract-path\n"
        "       check_memory_policy.py is-src-path <path>\n"
        "       check_memory_policy.py list-in-progress [--repo-root DIR]\n"
        "       check_memory_policy.py gate-in-progress [--repo-root DIR] [--config PATH]",
        file=sys.stderr,
    )


def _cmd_extract_path(argv: list[str]) -> int:
    if argv:
        _print_usage()
        return EXIT_USAGE
    raw = sys.stdin.read()
    if not raw.strip():
        return EXIT_OK
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        print("factory-policy: stdin is not JSON (environment)", file=sys.stderr)
        return EXIT_ENV
    path = extract_edit_path(payload)
    if path:
        print(path)
    return EXIT_OK


def _cmd_list_in_progress(repo_root: Path) -> int:
    for path in list_in_progress(repo_root):
        print(path)
    return EXIT_OK


def _cmd_gate_in_progress(repo_root: Path, config_path: Path) -> int:
    try:
        modes = load_modes(config_path)
    except (OSError, ValueError) as exc:
        print(f"factory-policy: {exc}", file=sys.stderr)
        return EXIT_ENV
    memories = list_in_progress(repo_root)
    if not memories:
        findings = [missing_memory_finding(modes)]
        emit_findings(findings)
        if any(finding.mode == "fail" for finding in findings):
            return EXIT_VIOLATION
        return EXIT_OK
    return _cmd_check([str(path) for path in memories], repo_root, config_path)


def _cmd_check(
    memories: list[str], repo_root: Path, config_path: Path
) -> int:
    if not memories:
        _print_usage()
        return EXIT_USAGE
    try:
        modes = load_modes(config_path)
    except (OSError, ValueError) as exc:
        print(f"factory-policy: {exc}", file=sys.stderr)
        return EXIT_ENV

    all_findings: list[Finding] = []
    for arg in memories:
        path = Path(arg)
        try:
            text = path.read_text(encoding="utf-8")
        except OSError as exc:
            print(f"factory-policy: cannot read {arg} ({exc})", file=sys.stderr)
            return EXIT_ENV
        all_findings.extend(check_memory(text, repo_root, modes))

    emit_findings(all_findings)
    if any(finding.mode == "fail" for finding in all_findings):
        return EXIT_VIOLATION
    return EXIT_OK


def main(argv: list[str] | None = None) -> int:
    args = sys.argv[1:] if argv is None else argv
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("--repo-root", default=None)
    parser.add_argument("--config", default=None)
    parser.add_argument(
        "rest",
        nargs="*",
        help="memory paths, or extract-path / list-in-progress",
    )
    try:
        parsed = parser.parse_args(args)
    except SystemExit as exc:
        code = exc.code
        if code in (0, None):
            return EXIT_OK
        return EXIT_USAGE

    repo_root = Path(parsed.repo_root or os.environ.get("FACTORY_POLICY_REPO_ROOT") or Path.cwd())
    try:
        repo_root = repo_root.resolve()
    except OSError as exc:
        print(f"factory-policy: bad --repo-root ({exc})", file=sys.stderr)
        return EXIT_ENV

    rest: list[str] = list(parsed.rest)
    if rest and rest[0] == "extract-path":
        return _cmd_extract_path(rest[1:])
    if rest and rest[0] == "is-src-path":
        if len(rest) != 2 or not rest[1]:
            _print_usage()
            return EXIT_USAGE
        try:
            config_path = resolve_config_path(repo_root, parsed.config)
            globs = load_code_globs(config_path)
        except (OSError, ValueError) as exc:
            print(f"factory-policy: {exc}", file=sys.stderr)
            return EXIT_ENV
        return EXIT_OK if is_code_path(rest[1], globs) else EXIT_VIOLATION
    if rest and rest[0] == "list-in-progress":
        return _cmd_list_in_progress(repo_root)
    if rest and rest[0] == "gate-in-progress":
        try:
            config_path = resolve_config_path(repo_root, parsed.config)
        except OSError as exc:
            print(f"factory-policy: {exc}", file=sys.stderr)
            return EXIT_ENV
        return _cmd_gate_in_progress(repo_root, config_path)

    try:
        config_path = resolve_config_path(repo_root, parsed.config)
    except OSError as exc:
        print(f"factory-policy: {exc}", file=sys.stderr)
        return EXIT_ENV
    return _cmd_check(rest, repo_root, config_path)


if __name__ == "__main__":
    raise SystemExit(main())
