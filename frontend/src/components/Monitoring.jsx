import { useEffect, useState } from "react";

function Monitoring() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8001/monitoring")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!stats) {
    return <h2>Loading monitoring data...</h2>;
  }

  return (
    <div className="dashboard">
      <h1>Monitoring Dashboard</h1>

      {/* 📊 API Requests */}
      <div className="card">
        <h3>Total API Requests</h3>
        <p>{stats.api_request_count}</p>
      </div>

      {/* ⚠ Errors */}
      <div className="card">
        <h3>Total Errors</h3>
        <p>{stats.error_count}</p>
      </div>

      {/* ⏱ Response Time */}
      <div className="card">
        <h3>Average Response Time</h3>
        <p>{stats.avg_response_time_ms} ms</p>
      </div>

      {/* ❤️ Health */}
      <div className="card">
        <h3>System Health</h3>

        <p
          className={
            stats.system_health_status === "ok"
              ? "status-ok"
              : "status-bad"
          }
        >
          {stats.system_health_status}
        </p>
      </div>
    </div>
  );
}

export default Monitoring;