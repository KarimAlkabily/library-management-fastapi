import { useState } from "react";

export default function BookCard({ id, title, author, role, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editAuthor, setEditAuthor] = useState(author);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");

  const token = localStorage.getItem("token");

  const showMsg = (text, type = "success") => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = () => {
    if (!confirm(`Delete "${title}"?`)) return;
    fetch(`http://localhost:8001/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => onRefresh());
  };

  const handleUpdate = () => {
    fetch(`http://localhost:8001/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, author: editAuthor }),
    }).then(() => {
      setEditing(false);
      onRefresh();
    });
  };

  const handleBorrow = () => {
    fetch(`http://localhost:8001/borrow?book_id=${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) showMsg(data.message);
        else showMsg(data.detail || "Error", "error");
      });
  };

  const handleReturn = () => {
    fetch(`http://localhost:8001/borrow/return?book_id=${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) showMsg(data.message);
        else showMsg(data.detail || "Error", "error");
      });
  };

  return (
    <div style={styles.card}>
      <div style={styles.topAccent} />

      {editing ? (
        <div style={styles.editForm}>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
            placeholder="Author"
          />
          <div style={styles.actions}>
            <button className="btn-primary btn-sm" onClick={handleUpdate}>
              Save
            </button>
            <button className="btn-secondary btn-sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.body}>
          <div style={styles.bookIcon}>📖</div>
          <h3 style={styles.bookTitle}>{title}</h3>
          <p style={styles.bookAuthor}>{author}</p>

          {message && (
            <div className={msgType === "error" ? "error-msg" : "success-msg"} style={{ fontSize: "12px", padding: "6px 10px" }}>
              {message}
            </div>
          )}

          <div style={styles.actions}>
            {role === "admin" ? (
              <>
                <button className="btn-secondary btn-sm" onClick={() => setEditing(true)}>
                  Edit
                </button>
                <button className="btn-danger btn-sm" onClick={handleDelete}>
                  Delete
                </button>
              </>
            ) : (
              <>
                <button className="btn-primary btn-sm" onClick={handleBorrow}>
                  Borrow
                </button>
                <button className="btn-gold btn-sm" onClick={handleReturn}>
                  Return
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-sm)",
    overflow: "hidden",
    transition: "box-shadow 0.2s, transform 0.2s",
    border: "1px solid var(--border)",
  },
  topAccent: {
    height: "4px",
    background: "linear-gradient(90deg, var(--navy), var(--gold))",
  },
  body: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  editForm: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  bookIcon: {
    fontSize: "24px",
    marginBottom: "4px",
  },
  bookTitle: {
    fontSize: "17px",
    color: "var(--navy)",
    fontFamily: "'Playfair Display', serif",
  },
  bookAuthor: {
    fontSize: "13px",
    color: "var(--text-muted)",
    marginBottom: "8px",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
};