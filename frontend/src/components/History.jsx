import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8001/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRecords(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const active = records.filter((r) => !r.returned);
  const returned = records.filter((r) => r.returned);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navLogo}>📚 Library</span>
        <button className="btn-secondary btn-sm" onClick={() => navigate("/books")}>
          ← Back to Books
        </button>
      </nav>

      <div style={styles.content}>
        <h2 style={styles.title}>My Borrowing History</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : records.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "48px" }}>📭</div>
            <p>You haven't borrowed any books yet.</p>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Currently Borrowed ({active.length})</h3>
                <div style={styles.list}>
                  {active.map((r) => (
                    <RecordRow key={r.id} record={r} />
                  ))}
                </div>
              </div>
            )}

            {returned.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Returned ({returned.length})</h3>
                <div style={styles.list}>
                  {returned.map((r) => (
                    <RecordRow key={r.id} record={r} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RecordRow({ record }) {
  return (
    <div style={styles.row}>
      <div style={styles.rowLeft}>
        <span style={{ fontSize: "20px" }}>📖</span>
        <div>
          <p style={styles.rowTitle}>Book ID: {record.book_id}</p>
          {record.Borrowed_at && (
            <p style={styles.rowDate}>
              Borrowed: {new Date(record.Borrowed_at).toLocaleDateString()}
            </p>
          )}
          {record.returned_at && (
            <p style={styles.rowDate}>
              Returned: {new Date(record.returned_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <span className={`badge ${record.returned ? "badge-returned" : "badge-active"}`}>
        {record.returned ? "Returned" : "Active"}
      </span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
  },
  nav: {
    background: "var(--surface)",
    boxShadow: "var(--shadow-sm)",
    padding: "0 32px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--navy)",
  },
  content: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  title: {
    fontSize: "26px",
    color: "var(--navy)",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  row: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  rowTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text)",
  },
  rowDate: {
    fontSize: "12px",
    color: "var(--text-muted)",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "var(--text-muted)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
  },
  empty: {
    color: "var(--text-muted)",
    textAlign: "center",
    padding: "40px",
  },
};