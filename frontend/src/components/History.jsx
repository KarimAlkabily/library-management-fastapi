import { useEffect, useState } from "react";

function History() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8001/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRecords(data));
  }, []);

  return (
    <div>
      <h2>My History</h2>

      {records.map((r) => (
        <div key={r.id}>
          <p>Book ID: {r.book_id}</p>
          <p>Returned: {r.returned ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
}

export default History;