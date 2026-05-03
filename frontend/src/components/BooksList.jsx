import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import AddBook from "./AddBook";

function BooksList() {
  const [books, setBooks] = useState([]);

  const fetchBooks = () => {
    fetch("http://localhost:8001/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Books</h1>

      <button onClick={handleLogout}>Logout</button>

      {/* 🔥 Add Book */}
      <AddBook onBookAdded={fetchBooks} />

      {/* 📚 List */}
      {books.map((book) => (
        <BookCard
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
          onRefresh={fetchBooks}
        />
      ))}
    </div>
  );
}

export default BooksList;