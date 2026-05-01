import logging
from typing import Any, Dict


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

app_logger = logging.getLogger("library_app")

monitoring_data: Dict[str, Any] = {
    "request_count": 0,
    "error_count": 0,
    "total_response_time_ms": 0.0,
}


def log_event(message: str, level: str = "info") -> None:
    if level == "error":
        app_logger.error(message)
    elif level == "warning":
        app_logger.warning(message)
    else:
        app_logger.info(message)


def record_request(status_code: int, response_time_ms: float) -> None:
    monitoring_data["request_count"] += 1
    monitoring_data["total_response_time_ms"] += response_time_ms
    if status_code >= 400:
        monitoring_data["error_count"] += 1


def get_monitoring_snapshot() -> Dict[str, Any]:
    request_count = monitoring_data["request_count"]
    avg_response_time = (
        monitoring_data["total_response_time_ms"] / request_count if request_count else 0.0
    )
    return {
        "api_request_count": request_count,
        "avg_response_time_ms": round(avg_response_time, 2),
        "error_count": monitoring_data["error_count"],
        "system_health_status": "ok",
    }
