import { useState } from "react";

function AddBook({ onBookAdded }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleAdd = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8001/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, author }),
    })
      .then((res) => res.json())
      .then(() => {
        setTitle("");
        setAuthor("");
        onBookAdded(); // 🔥 refresh
      });
  };

  return (
    <div>
      <h3>Add Book</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddBook;