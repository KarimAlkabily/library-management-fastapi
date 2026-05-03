import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import AddBook from "./AddBook";

function BooksList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const role = localStorage.getItem("role");

  const booksPerPage = 3;

  const fetchBooks = () => {
    fetch("http://localhost:8001/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(
    start,
    start + booksPerPage
  );

  return (
    <div>
      <h1>Books</h1>

      <button onClick={handleLogout}>Logout</button>

      <input
        placeholder="Search books..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reset pagination
        }}
      />

      
      <button onClick={() => (window.location.href = "/history")}>
        My History
      </button>

      
      {role === "admin" && <AddBook onBookAdded={fetchBooks} />}

      
      {paginatedBooks.map((book) => (
        <BookCard
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
          onRefresh={fetchBooks}
        />
      ))}

      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>

        <span> Page {page} </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={start + booksPerPage >= filteredBooks.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BooksList;