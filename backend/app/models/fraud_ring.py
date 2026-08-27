from dataclasses import dataclass, field
from typing import Any

from app.models.risk_signal import RiskSignal


@dataclass
class FraudRing:
    ring_id: str
    risk_score: int
    severity: str
    signals: list[RiskSignal] = field(default_factory=list)
    entities: list[dict[str, Any]] = field(default_factory=list)