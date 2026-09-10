"""Regressions for read gating and unquoted prose after Gate commands."""

import importlib.util
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("policy_contract", ROOT / "scripts/check_memory_policy.py")
policy = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(policy)


class HarnessContractTests(unittest.TestCase):
    def test_read_tools_do_not_enter_the_edit_gate(self):
        for key in ("tool_name", "toolName"):
            for tool in ("Read", "read_file", "view_file", "Glob", "Grep", "LS", "list_dir"):
                with self.subTest(key=key, tool=tool):
                    self.assertIsNone(policy.extract_edit_path({key: tool, "tool_input": {"file_path": "src/probe.py"}}))

    def test_write_unknown_and_legacy_payloads_still_enter_the_gate(self):
        for tool in ("Edit", "Write", "MultiEdit", "Shell", "Bash", "unknown", ""):
            with self.subTest(tool=tool):
                self.assertEqual(policy.extract_edit_path({"tool_name": tool, "tool_input": {"path": "src/probe.py"}}), "src/probe.py")

    def test_gate_prose_preserves_quoted_and_real_dot_ending_names(self):
        modes = {key: "off" for key in policy.CHECK_IDS}
        modes["C5"] = "fail"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "gate.sh").touch()
            (root / "real.sh.").touch()
            for command, expected in (
                ("./gate.sh. Following sentence.", []),
                ("./real.sh. Following sentence.", []),
                ("`./gate.sh`. Following sentence.", []),
                ("`./gate.sh.`", ["C5"]),
                ("'./gate.sh.'", ["C5"]),
                ("./missing.sh. Following sentence.", ["C5"]),
            ):
                with self.subTest(command=command):
                    memory = f"## Task (TCREI)\n- **Evaluation**: verifiable. Gate: {command}\n"
                    self.assertEqual([f.check_id for f in policy.check_memory(memory, root, modes)], expected)


if __name__ == "__main__":
    unittest.main()
