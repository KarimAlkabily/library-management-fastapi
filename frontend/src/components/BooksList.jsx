import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "./BookCard";
import AddBook from "./AddBook";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const booksPerPage = 6;

  const fetchBooks = () => {
    setLoading(true);
    fetch("http://localhost:8001/books")
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const start = (page - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(start, start + booksPerPage);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <span style={styles.navLogo}>📚 Library</span>
          <span className={`badge ${role === "admin" ? "badge-admin" : "badge-member"}`}>
            {role}
          </span>
        </div>
        <div style={styles.navRight}>
          <button className="btn-secondary btn-sm" onClick={() => navigate("/history")}>
            My History
          </button>
          <button className="btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.topBar}>
          <h2 style={styles.pageTitle}>All Books</h2>
          <input
            style={{ maxWidth: "280px" }}
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {role === "admin" && <AddBook onBookAdded={fetchBooks} />}

        {loading ? (
          <div style={styles.empty}>Loading books...</div>
        ) : paginatedBooks.length === 0 ? (
          <div style={styles.empty}>No books found.</div>
        ) : (
          <div style={styles.grid}>
            {paginatedBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                role={role}
                onRefresh={fetchBooks}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              className="btn-secondary btn-sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span style={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn-secondary btn-sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
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
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  navLogo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--navy)",
  },
  navRight: {
    display: "flex",
    gap: "10px",
  },
  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  },
  pageTitle: {
    fontSize: "24px",
    color: "var(--navy)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    paddingTop: "8px",
  },
  pageInfo: {
    fontSize: "14px",
    color: "var(--text-muted)",
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    color: "var(--text-muted)",
    padding: "60px 20px",
    fontSize: "15px",
  },
};