from dataclasses import dataclass
from typing import Any


@dataclass
class RiskSignal:
    signal_type: str
    severity: str
    score: int
    description: str
    evidence: dict[str, Any]