import os

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from neo4j.exceptions import ServiceUnavailable, SessionExpired

from app.api.fraud import router as fraud_router


app = FastAPI(
    title="Fraud Detection API",
    description="Graph-based financial fraud detection system",
    version="1.0.0"
)


app.include_router(fraud_router)


frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def database_unavailable_response(
    request: Request,
    exception: Exception
):
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Fraud detection database is temporarily unavailable"
        },
        headers={"Retry-After": "30"}
    )


app.add_exception_handler(ServiceUnavailable, database_unavailable_response)
app.add_exception_handler(SessionExpired, database_unavailable_response)


@app.get("/")
def root():
    return {
        "message": "Fraud Detection API is running"
    }