import { useState, useEffect } from "react";
import BookCard from "./BookCard";

function BooksList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8001/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
      });
  }, []);

  return (
    <div>
      <h1>Books</h1>

      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
        />
      ))}
    </div>
  );
}

export default BooksList;