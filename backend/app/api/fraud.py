from fastapi import APIRouter, HTTPException

from app.services.fraud_service import FraudDetectionService

router = APIRouter(
    prefix="/api/fraud",
    tags=["Fraud Detection"]
)


service = FraudDetectionService()


@router.get("/accounts/{account_id}")
def investigate_account(account_id: str):

    result = service.investigate_account(account_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Account {account_id} not found"
        )

    return result

@router.get("/shared-devices")
def get_shared_devices():
    try:
        return service.detect_shared_devices()
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to fraud detection database"
        )


@router.get("/rapid-money-movement")
def get_rapid_money_movement():
    try:
        return service.detect_rapid_money_movement()
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Unable to detect rapid money movement"
        )


@router.get("/circular-transactions")
def get_circular_transactions():
    try:
        return service.detect_circular_transactions()
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Unable to detect circular transactions"
        )

@router.get("/dashboard")
def get_dashboard():
    try:
        return service.get_dashboard()

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Unable to load fraud dashboard"
        )

@router.get("/accounts/{account_id}/network")
def get_account_network(account_id: str):

    result = service.get_account_network(account_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Account {account_id} not found"
        )

    return result