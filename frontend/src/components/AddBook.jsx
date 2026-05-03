import { useState } from "react";

export default function AddBook({ onBookAdded }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!title.trim() || !author.trim()) {
      setError("Title and author are required");
      return;
    }
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    fetch("http://localhost:8001/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: title.trim(), author: author.trim() }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(d.detail) });
        return res.json();
      })
      .then(() => {
        setTitle("");
        setAuthor("");
        onBookAdded();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>Add New Book</h3>
      {error && <div className="error-msg" style={{ fontSize: "13px" }}>{error}</div>}
      <div style={styles.row}>
        <input
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          className="btn-primary"
          style={{ whiteSpace: "nowrap", padding: "10px 24px" }}
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? "Adding..." : "+ Add Book"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "var(--surface)",
    border: "1.5px dashed var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  heading: {
    fontSize: "16px",
    color: "var(--navy)",
    fontFamily: "'Playfair Display', serif",
  },
  row: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
};