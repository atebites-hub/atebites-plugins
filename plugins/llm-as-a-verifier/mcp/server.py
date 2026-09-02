#!/usr/bin/env python3
"""Stdio MCP server for LLM-as-a-Verifier.

Exposes select / compare / track by calling the published llm_verifier Python
API. Does not reimplement the pivot tournament. Failures (missing install or
API key) return isError text the host can show the model.
"""

from __future__ import annotations

import json
import os
import sys
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VENDOR = ROOT / "vendor" / "llm-as-a-verifier"
SERVER_INFO = {"name": "llm-as-a-verifier", "version": "0.2.0"}

SELECT_TOOL = {
    "name": "select",
    "description": (
        "Rank N candidate trajectories or answers with LLM-as-a-Verifier and "
        "return the best index. Use for high-stakes ODW leaves and best-of-N, "
        "not for every agent() call. Requires llm-verifier and a logprob "
        "backend (DEEPSEEK_API_KEY, VERTEX_API_KEY, or OPENAI_BASE_URL)."
    ),
    "inputSchema": {
        "type": "object",
        "required": ["problem", "candidates", "criteria"],
        "properties": {
            "problem": {"type": "string", "description": "Task shown to the verifier."},
            "candidates": {
                "type": "array",
                "items": {"type": "string"},
                "description": "N candidate traces or answers to rank.",
            },
            "criteria": {
                "description": "Dict of {name: description}, a bundled name (e.g. swe_bench), or a criteria file path.",
            },
            "n_evaluations": {"type": "integer", "default": 4},
            "pivots": {"type": "integer", "default": 2},
            "model": {"type": "string", "description": "Verifier model (default gemini-2.5-flash)."},
        },
    },
}

COMPARE_TOOL = {
    "name": "compare",
    "description": (
        "Pairwise LLM-as-a-Verifier scores (R_A, R_B) in [0, 1] for two traces. "
        "Building block of select; use when you only have two candidates."
    ),
    "inputSchema": {
        "type": "object",
        "required": ["problem", "trace_a", "trace_b", "criteria"],
        "properties": {
            "problem": {"type": "string"},
            "trace_a": {"type": "string"},
            "trace_b": {"type": "string"},
            "criteria": {"description": "Same forms as select."},
            "n_evaluations": {"type": "integer", "default": 1},
            "model": {"type": "string"},
        },
    },
}

TRACK_TOOL = {
    "name": "track",
    "description": (
        "Score progress at selected checkpoints of a finished trajectory "
        "(default: interior steps). Use on long high-stakes jobs, not every "
        "turn. Not Advisor runtime evidence."
    ),
    "inputSchema": {
        "type": "object",
        "required": ["problem", "steps"],
        "properties": {
            "problem": {"type": "string"},
            "steps": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Ordered agent steps so far.",
            },
            "checkpoint_steps": {
                "type": "array",
                "items": {"type": "integer"},
                "description": "1-based checkpoints; default is interior steps 2..T-1 (every step if T<3).",
            },
            "n_evaluations": {"type": "integer", "default": 1},
            "model": {"type": "string"},
        },
    },
}

TOOLS = [SELECT_TOOL, COMPARE_TOOL, TRACK_TOOL]
REQUIRED_ARGS = {
    "select": ("problem", "candidates", "criteria"),
    "compare": ("problem", "trace_a", "trace_b", "criteria"),
    "track": ("problem", "steps"),
}
response_framing = "content-length"
buffer = b""


def write_message(message: dict) -> None:
    body = json.dumps(message, ensure_ascii=False)
    if response_framing == "line":
        sys.stdout.write(body + "\n")
        sys.stdout.flush()
        return
    encoded = body.encode("utf-8")
    sys.stdout.write(f"Content-Length: {len(encoded)}\r\n\r\n")
    sys.stdout.flush()
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()


def ok(msg_id, result) -> None:
    write_message({"jsonrpc": "2.0", "id": msg_id, "result": result})


def fail(msg_id, code: int, message: str) -> None:
    write_message(
        {"jsonrpc": "2.0", "id": msg_id, "error": {"code": code, "message": message}}
    )


def tool_error(text: str) -> dict:
    return {"content": [{"type": "text", "text": text}], "isError": True}


def tool_ok(payload) -> dict:
    return {
        "content": [{"type": "text", "text": json.dumps(payload, ensure_ascii=False, indent=2)}],
        "isError": False,
    }


def load_library():
    if os.environ.get("LLM_VERIFIER_TEST_UNAVAILABLE") == "1":
        return None, (
            "llm-verifier is not installed. pip install llm-verifier"
        )
    try:
        import llm_verifier  # type: ignore

        return llm_verifier, None
    except ImportError:
        if VENDOR.is_dir() and str(VENDOR) not in sys.path:
            sys.path.insert(0, str(VENDOR))
            try:
                import llm_verifier  # type: ignore

                return llm_verifier, None
            except ImportError as exc:
                return None, (
                    f"llm-verifier import failed ({exc}). "
                    "pip install llm-verifier"
                )
        return None, (
            "llm-verifier is not installed. pip install llm-verifier"
        )


def missing_key_message(exc: BaseException | None = None) -> str:
    prefix = f"{exc}. " if exc else ""
    return (
        f"{prefix}Set DEEPSEEK_API_KEY, VERTEX_API_KEY, or OPENAI_BASE_URL "
        "(OpenAI-compatible server that returns token logprobs). "
        "See vendor/llm-as-a-verifier/.env.example."
    )


def ensure_credentials(lib) -> str | None:
    """Fail fast when no logprob backend is configured.

    The library also raises MissingAPIKeyError; this check avoids starting a
    tournament just to discover the same gap.
    """
    if hasattr(lib, "load_dotenv"):
        lib.load_dotenv()
    if (
        os.environ.get("OPENAI_BASE_URL")
        or os.environ.get("DEEPSEEK_API_KEY")
        or os.environ.get("VERTEX_API_KEY")
    ):
        return None
    return missing_key_message()


def call_select(lib, args: dict):
    kwargs = {
        "problem": args["problem"],
        "candidates": args["candidates"],
        "criteria": args["criteria"],
    }
    if "n_evaluations" in args:
        kwargs["n_evaluations"] = int(args["n_evaluations"])
    if "pivots" in args:
        kwargs["pivots"] = int(args["pivots"])
    if args.get("model"):
        kwargs["model"] = args["model"]
    kwargs["progress"] = False
    result = lib.select(**kwargs)
    return {
        "index": result.index,
        "ranking": result.ranking,
        "scores": list(result.scores),
        "n_comparisons": result.n_comparisons,
        "criteria": list(result.criteria),
    }


def call_compare(lib, args: dict):
    kwargs = {
        "problem": args["problem"],
        "trace_a": args["trace_a"],
        "trace_b": args["trace_b"],
        "criteria": args["criteria"],
    }
    if "n_evaluations" in args:
        kwargs["n_evaluations"] = int(args["n_evaluations"])
    if args.get("model"):
        kwargs["model"] = args["model"]
    reward_a, reward_b = lib.compare(**kwargs)
    return {"reward_a": reward_a, "reward_b": reward_b}


def call_track(lib, args: dict):
    kwargs = {"problem": args["problem"], "steps": args["steps"]}
    if args.get("checkpoint_steps"):
        kwargs["checkpoint_steps"] = [int(n) for n in args["checkpoint_steps"]]
    if "n_evaluations" in args:
        kwargs["n_evaluations"] = int(args["n_evaluations"])
    if args.get("model"):
        kwargs["model"] = args["model"]
    result = lib.track(**kwargs)
    scores = list(getattr(result, "scores", result))
    payload = {"scores": scores}
    for attr in ("steps", "checkpoint_steps", "n_evaluations", "final"):
        if hasattr(result, attr):
            value = getattr(result, attr)
            payload[attr] = list(value) if attr == "steps" else value
    return payload


def run_tool(name: str, args: dict) -> dict:
    lib, err = load_library()
    if err:
        return tool_error(err)
    if name not in REQUIRED_ARGS:
        return tool_error(f"Unknown tool: {name}")
    missing = [key for key in REQUIRED_ARGS[name] if key not in args]
    if missing:
        return tool_error(f"Missing arguments: {', '.join(missing)}")
    cred_err = ensure_credentials(lib)
    if cred_err:
        return tool_error(cred_err)
    try:
        if name == "select":
            return tool_ok(call_select(lib, args))
        if name == "compare":
            return tool_ok(call_compare(lib, args))
        return tool_ok(call_track(lib, args))
    except getattr(lib, "MissingAPIKeyError", ()) as exc:
        return tool_error(missing_key_message(exc))
    except ModuleNotFoundError as exc:
        return tool_error(
            f"Missing Python dependency ({exc}). pip install llm-verifier"
        )
    except Exception as exc:
        return tool_error(f"{type(exc).__name__}: {exc}\n{traceback.format_exc()}")


def handle_request(msg: dict) -> None:
    if not isinstance(msg, dict):
        fail(None, -32600, "Invalid Request")
        return
    method = msg.get("method")
    msg_id = msg.get("id")
    params = msg.get("params") or {}
    if method is None:
        return
    if msg_id is None and method.startswith("notifications/"):
        return
    if method == "initialize":
        ok(
            msg_id,
            {
                "protocolVersion": params.get("protocolVersion") or "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": SERVER_INFO,
            },
        )
        return
    if method in ("notifications/initialized", "initialized"):
        return
    if method == "ping":
        ok(msg_id, {})
        return
    if method == "tools/list":
        ok(msg_id, {"tools": TOOLS})
        return
    if method == "tools/call":
        name = params.get("name")
        args = params.get("arguments") or {}
        ok(msg_id, run_tool(name, args))
        return
    fail(msg_id, -32601, f"Method not found: {method}")


def handle_raw(raw: str) -> None:
    trimmed = raw.strip()
    if not trimmed:
        return
    try:
        msg = json.loads(trimmed)
    except json.JSONDecodeError as exc:
        sys.stderr.write(f"[llm-as-a-verifier] bad JSON: {exc}\n")
        fail(None, -32700, "Parse error")
        return
    if isinstance(msg, list):
        for item in msg:
            handle_request(item)
        return
    handle_request(msg)


def read_stdin_chunk() -> bytes:
    """Return available stdin bytes without waiting for a full 4096-byte block.

    ``BufferedReader.read(n)`` blocks until n bytes or EOF, which hangs MCP
    hosts that keep stdin open and send small JSON-RPC frames.
    """
    try:
        return os.read(sys.stdin.fileno(), 4096)
    except InterruptedError:
        return b""


def main() -> None:
    global buffer, response_framing
    sys.stderr.write("[llm-as-a-verifier] MCP server ready (select, compare, track)\n")
    sys.stderr.flush()
    while True:
        chunk = read_stdin_chunk()
        if not chunk:
            if buffer:
                handle_raw(buffer.decode("utf-8", errors="replace"))
            break
        buffer += chunk
        while True:
            header_end = buffer.find(b"\r\n\r\n")
            if header_end == -1:
                text = buffer.decode("utf-8", errors="replace")
                if "\n" in text and text.lstrip().startswith("{"):
                    response_framing = "line"
                    lines = text.splitlines()
                    buffer = lines[-1].encode("utf-8") if not text.endswith("\n") else b""
                    complete = lines[:-1] if not text.endswith("\n") else lines
                    for line in complete:
                        handle_raw(line)
                break
            header = buffer[:header_end].decode("utf-8", errors="replace")
            match = None
            for line in header.splitlines():
                if line.lower().startswith("content-length:"):
                    match = line.split(":", 1)[1].strip()
                    break
            if match is None:
                buffer = buffer[header_end + 4 :]
                continue
            length = int(match)
            body_start = header_end + 4
            body_end = body_start + length
            if len(buffer) < body_end:
                break
            body = buffer[body_start:body_end].decode("utf-8")
            buffer = buffer[body_end:]
            response_framing = "content-length"
            handle_raw(body)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
