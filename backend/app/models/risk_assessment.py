class RiskAssessment:

    def __init__(
        self,
        score: int,
        level: str,
        reasons: list[str]
    ):
        self.score = score
        self.level = level
        self.reasons = reasons

    def to_dict(self):
        return {
            "score": self.score,
            "level": self.level,
            "reasons": self.reasons
        }