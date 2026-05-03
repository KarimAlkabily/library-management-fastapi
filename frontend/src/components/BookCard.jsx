import { useState } from "react";

function BookCard(props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [author, setAuthor] = useState(props.author);

  const token = localStorage.getItem("token");

  // 🔥 DELETE
  const handleDelete = () => {
    fetch(`http://localhost:8001/books/${props.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => props.onRefresh());
  };

  // 🔥 UPDATE
  const handleUpdate = () => {
    fetch(`http://localhost:8001/books/${props.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, author }),
    }).then(() => {
      setEditing(false);
      props.onRefresh();
    });
  };

  return (
    <div>
      {editing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <h3>{props.title}</h3>
          <p>{props.author}</p>
        </>
      )}

      <button onClick={() => setEditing(!editing)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default BookCard;