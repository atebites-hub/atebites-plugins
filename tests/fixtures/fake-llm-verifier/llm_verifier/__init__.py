"""Test double for llm_verifier. Records calls; does not run PPT."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field


class MissingAPIKeyError(RuntimeError):
    """Mirror of llm_verifier.MissingAPIKeyError."""


def load_dotenv(root_dir=None):
    return None


def _record(name: str, payload: dict) -> None:
    path = os.environ.get("LLM_VERIFIER_TEST_LOG")
    if not path:
        return
    with open(path, "a", encoding="utf-8") as handle:
        handle.write(json.dumps({"name": name, **payload}, ensure_ascii=False) + "\n")


@dataclass
class VerifierResult:
    index: int = 0
    best: str = ""
    scores: list = field(default_factory=lambda: [0.9, 0.1])
    n_comparisons: int = 1
    criteria: list = field(default_factory=lambda: ["Correctness"])

    @property
    def ranking(self):
        return sorted(range(len(self.scores)), key=lambda i: (-self.scores[i], i))


@dataclass
class ProgressResult:
    steps: list = field(default_factory=lambda: [2])
    scores: list = field(default_factory=lambda: [0.42])

    @property
    def final(self):
        return self.scores[-1]


def select(problem, candidates, *, criteria, **kwargs):
    _record(
        "select",
        {
            "problem": problem,
            "candidates": list(candidates),
            "criteria": criteria,
            "kwargs": {k: v for k, v in kwargs.items() if k != "client"},
        },
    )
    return VerifierResult(best=candidates[0], criteria=list(criteria) if hasattr(criteria, "__iter__") and not isinstance(criteria, str) else ["Correctness"])


def compare(problem, trace_a, trace_b, *, criteria, **kwargs):
    _record(
        "compare",
        {
            "problem": problem,
            "trace_a": trace_a,
            "trace_b": trace_b,
            "criteria": criteria,
            "kwargs": {k: v for k, v in kwargs.items() if k != "client"},
        },
    )
    return (0.8, 0.2)


def track(problem, steps, **kwargs):
    _record(
        "track",
        {
            "problem": problem,
            "steps": list(steps),
            "kwargs": {k: v for k, v in kwargs.items() if k != "client"},
        },
    )
    return ProgressResult()
