"""Unit tests for factory-policy v1 check_memory_policy.py."""

from __future__ import annotations

import importlib.util
import io
import json
import sys
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

_HELPER = Path(__file__).resolve().parents[1] / "scripts" / "check_memory_policy.py"
_FIXTURES = Path(__file__).resolve().parent / "fixtures"
_CONSUMER = _FIXTURES / "consumer"
_MEMORIES = _CONSUMER / "docs" / "memories"
_FAIL_ALL = _FIXTURES / "fail-all.toml"
_CODE_BACKEND = _FIXTURES / "code-backend.toml"
_SHIPPED = Path(__file__).resolve().parents[1] / "config" / "policy.toml"

_spec = importlib.util.spec_from_file_location("check_memory_policy", _HELPER)
assert _spec is not None and _spec.loader is not None
cmp = importlib.util.module_from_spec(_spec)
sys.modules["check_memory_policy"] = cmp
_spec.loader.exec_module(cmp)


def _modes(overrides: dict[str, str] | None = None) -> dict[str, str]:
    modes = dict(cmp.DEFAULT_MODES)
    if overrides:
        modes.update(overrides)
    return modes


def _read(name: str) -> str:
    return (_MEMORIES / name).read_text(encoding="utf-8")


def _ids(findings: list[cmp.Finding]) -> list[str]:
    return [finding.check_id for finding in findings]


class CheckSemanticsTests(unittest.TestCase):
    def test_pass_all_default_warn(self) -> None:
        findings = cmp.check_memory(_read("pass-all.md"), _CONSUMER, _modes())
        self.assertEqual(findings, [])

    def test_pass_odw_scope(self) -> None:
        findings = cmp.check_memory(_read("pass-odw.md"), _CONSUMER, _modes())
        self.assertEqual(findings, [])

    def test_pass_linear_c6(self) -> None:
        findings = cmp.check_memory(_read("pass-linear.md"), _CONSUMER, _modes())
        self.assertEqual(findings, [])

    def test_pass_non_verifiable_skips_c5(self) -> None:
        findings = cmp.check_memory(_read("pass-non-verifiable.md"), _CONSUMER, _modes())
        self.assertEqual(findings, [])

    def test_fail_c31_doc_cited(self) -> None:
        findings = cmp.check_memory(_read("fail-c31.md"), _CONSUMER, _modes())
        self.assertEqual(_ids(findings), ["C3.1"])

    def test_fail_c32_scope_literal(self) -> None:
        findings = cmp.check_memory(_read("fail-c32.md"), _CONSUMER, _modes())
        self.assertEqual(_ids(findings), ["C3.2"])

    def test_fail_c33_todo(self) -> None:
        findings = cmp.check_memory(_read("fail-c33-todo.md"), _CONSUMER, _modes())
        self.assertEqual(_ids(findings), ["C3.3"])

    def test_fail_c33_ordered_placeholder(self) -> None:
        findings = cmp.check_memory(_read("fail-c33-ordered.md"), _CONSUMER, _modes())
        self.assertEqual(_ids(findings), ["C3.3"])

    def test_fail_c5_missing_gate(self) -> None:
        findings = cmp.check_memory(_read("fail-c5-missing.md"), _CONSUMER, _modes())
        self.assertEqual(_ids(findings), ["C5"])

    def test_fail_c5_unresolvable(self) -> None:
        findings = cmp.check_memory(_read("fail-c5-unresolvable.md"), _CONSUMER, _modes())
        self.assertEqual(_ids(findings), ["C5"])

    def test_fail_c6_issue_linked(self) -> None:
        findings = cmp.check_memory(_read("fail-c6.md"), _CONSUMER, _modes())
        self.assertEqual(_ids(findings), ["C6"])

    def test_off_mode_suppresses_finding(self) -> None:
        findings = cmp.check_memory(_read("fail-c32.md"), _CONSUMER, _modes({"C3.2": "off"}))
        self.assertEqual(findings, [])

    def test_no_c4_in_defaults_or_findings(self) -> None:
        self.assertNotIn("C4", cmp.DEFAULT_MODES)
        findings = cmp.check_memory(_read("pass-all.md"), _CONSUMER, _modes())
        self.assertNotIn("C4", _ids(findings))

    def test_c7_fail_is_warn_stub(self) -> None:
        findings = cmp.check_memory(_read("pass-all.md"), _CONSUMER, _modes({"C7": "fail"}))
        self.assertEqual(_ids(findings), ["C7"])
        self.assertEqual(findings[0].mode, "warn")
        self.assertIn("not implemented", findings[0].message)


class ConfigAndPathTests(unittest.TestCase):
    def test_shipped_config_defaults_warn(self) -> None:
        modes = cmp.load_modes(_SHIPPED)
        for check_id in ("C3.1", "C3.2", "C3.3", "C5", "C6"):
            self.assertEqual(modes[check_id], "warn", check_id)
        self.assertNotIn("C4", modes)

    def test_fail_overlay(self) -> None:
        modes = cmp.load_modes(_FAIL_ALL)
        self.assertEqual(modes["C3.2"], "fail")
        self.assertEqual(modes["C7"], "fail")

    def test_is_src_path(self) -> None:
        self.assertTrue(cmp.is_src_path("src/example.py"))
        self.assertTrue(cmp.is_src_path("/tmp/repo/src/pkg/mod.py"))
        self.assertFalse(cmp.is_src_path("docs/memories/pass-all.md"))
        self.assertFalse(cmp.is_src_path("src_notes.md"))
        self.assertFalse(cmp.is_src_path("backend/foo.py"))

    def test_shipped_code_globs_default_src(self) -> None:
        self.assertEqual(cmp.load_code_globs(_SHIPPED), ["src/**"])

    def test_overlay_without_paths_keeps_src_default(self) -> None:
        self.assertEqual(cmp.load_code_globs(_FAIL_ALL), ["src/**"])

    def test_overlay_code_globs_include_backend(self) -> None:
        self.assertEqual(
            cmp.load_code_globs(_CODE_BACKEND),
            ["backend/**", "frontend/**", "src/**"],
        )

    def test_is_code_path_default_src_only(self) -> None:
        globs = ["src/**"]
        self.assertTrue(cmp.is_code_path("src/example.py", globs))
        self.assertTrue(cmp.is_code_path("/tmp/repo/src/pkg/mod.py", globs))
        self.assertTrue(cmp.is_code_path("src", globs))
        self.assertFalse(cmp.is_code_path("backend/foo.py", globs))
        self.assertFalse(cmp.is_code_path("docs/memories/pass-all.md", globs))
        self.assertFalse(cmp.is_code_path("src_notes.md", globs))

    def test_is_code_path_overlay_includes_backend(self) -> None:
        globs = ["backend/**", "frontend/**", "src/**"]
        self.assertTrue(cmp.is_code_path("backend/foo.py", globs))
        self.assertTrue(cmp.is_code_path("frontend/app.js", globs))
        self.assertTrue(cmp.is_code_path("src/example.py", globs))
        self.assertFalse(cmp.is_code_path("docs/readme.md", globs))
        self.assertFalse(cmp.is_code_path("qa/notes.md", globs))

    def test_extract_edit_path_tool_input(self) -> None:
        payload = {"tool_input": {"file_path": "src/example.py"}}
        self.assertEqual(cmp.extract_edit_path(payload), "src/example.py")

    def test_extract_edit_path_cursor_shape(self) -> None:
        payload = {"tool_name": "Write", "tool_input": {"path": "src/example.py"}}
        self.assertEqual(cmp.extract_edit_path(payload), "src/example.py")

    def test_command_resolves_which_and_relative(self) -> None:
        self.assertTrue(cmp.command_resolves("python3", _CONSUMER))
        self.assertTrue(cmp.command_resolves("scripts/ok-gate.sh", _CONSUMER))
        self.assertFalse(cmp.command_resolves("this-binary-does-not-exist-factory-policy-v1", _CONSUMER))

    def test_list_in_progress(self) -> None:
        found = cmp.list_in_progress(_CONSUMER)
        names = [path.name for path in found]
        self.assertEqual(names, ["pass-all.md"])

    def test_missing_memory_severity_follows_fail_dial(self) -> None:
        warn = cmp.missing_memory_finding(_modes())
        self.assertEqual(warn.mode, "warn")
        fail = cmp.missing_memory_finding(_modes({"C5": "fail"}))
        self.assertEqual(fail.mode, "fail")


class MainExitTests(unittest.TestCase):
    def test_usage_without_files(self) -> None:
        self.assertEqual(cmp.main(["--repo-root", str(_CONSUMER)]), cmp.EXIT_USAGE)

    def test_warn_violation_is_exit_0(self) -> None:
        memory = str(_MEMORIES / "fail-c32.md")
        self.assertEqual(
            cmp.main(["--repo-root", str(_CONSUMER), "--config", str(_SHIPPED), memory]),
            cmp.EXIT_OK,
        )

    def test_fail_violation_is_exit_1(self) -> None:
        memory = str(_MEMORIES / "fail-c32.md")
        self.assertEqual(
            cmp.main(["--repo-root", str(_CONSUMER), "--config", str(_FAIL_ALL), memory]),
            cmp.EXIT_VIOLATION,
        )

    def test_pass_is_exit_0(self) -> None:
        memory = str(_MEMORIES / "pass-all.md")
        self.assertEqual(
            cmp.main(["--repo-root", str(_CONSUMER), "--config", str(_FAIL_ALL), memory]),
            cmp.EXIT_OK,
        )

    def test_missing_config_is_env(self) -> None:
        memory = str(_MEMORIES / "pass-all.md")
        self.assertEqual(
            cmp.main(
                [
                    "--repo-root",
                    str(_CONSUMER),
                    "--config",
                    str(_FIXTURES / "no-such.toml"),
                    memory,
                ]
            ),
            cmp.EXIT_ENV,
        )

    def test_extract_path_cli(self) -> None:
        stdin = json.dumps({"tool_input": {"file_path": "src/x.py"}})
        buf = io.StringIO()
        with mock.patch("sys.stdin", io.StringIO(stdin)), redirect_stdout(buf):
            rc = cmp.main(["extract-path"])
        self.assertEqual(rc, cmp.EXIT_OK)
        self.assertEqual(buf.getvalue().strip(), "src/x.py")

    def test_is_src_path_cli(self) -> None:
        self.assertEqual(cmp.main(["is-src-path", "src/x.py"]), cmp.EXIT_OK)
        self.assertEqual(cmp.main(["is-src-path", "README.md"]), cmp.EXIT_VIOLATION)
        self.assertEqual(
            cmp.main(["--config", str(_SHIPPED), "is-src-path", "backend/foo.py"]),
            cmp.EXIT_VIOLATION,
        )

    def test_is_src_path_cli_respects_config_globs(self) -> None:
        self.assertEqual(
            cmp.main(["--config", str(_CODE_BACKEND), "is-src-path", "backend/foo.py"]),
            cmp.EXIT_OK,
        )
        self.assertEqual(
            cmp.main(["--config", str(_CODE_BACKEND), "is-src-path", "docs/x.md"]),
            cmp.EXIT_VIOLATION,
        )
        self.assertEqual(
            cmp.main(["--config", str(_CODE_BACKEND), "is-src-path", "src/example.py"]),
            cmp.EXIT_OK,
        )


if __name__ == "__main__":
    unittest.main()
