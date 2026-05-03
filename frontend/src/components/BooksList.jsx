import { useState, useEffect } from "react";
import BookCard from "./BookCard";

function BooksList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8001/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Books</h1>

      <button onClick={handleLogout}>Logout</button>

      {books.map((book) => (
        <BookCard
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
        />
      ))}
    </div>
  );
}

export default BooksList;