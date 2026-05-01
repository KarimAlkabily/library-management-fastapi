import time

from fastapi import FastAPI, Request
from app.routes import books
from app.models import book,user,borrow
from app.db import engine,Base
from app.utils.logger import (
    get_monitoring_snapshot,
    log_event,
    record_request,
)
from fastapi.middleware.cors import CORSMiddleware




app=FastAPI()
app.include_router(books.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    start_time = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception as exc:
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        record_request(500, elapsed_ms)
        log_event(f"{request.method} {request.url.path} -> 500 | {round(elapsed_ms, 2)}ms", "error")
        raise

    elapsed_ms = (time.perf_counter() - start_time) * 1000
    record_request(response.status_code, elapsed_ms)
    log_event(
        f"{request.method} {request.url.path} -> {response.status_code} | {round(elapsed_ms, 2)}ms"
    )
    return response


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/monitoring")
def monitoring_dashboard():
    return get_monitoring_snapshot()

Base.metadata.create_all(bind=engine)