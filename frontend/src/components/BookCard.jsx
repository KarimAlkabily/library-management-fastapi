function BookCard(props) {
  const handleBorrow = () => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8001/borrow?book_id=${props.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const handleReturn = () => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8001/return?book_id=${props.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div>
      <h3>{props.title}</h3>
      <p>{props.author}</p>

      <button onClick={handleBorrow}>Borrow</button>
      <button onClick={handleReturn}>Return</button>
    </div>
  );
}

export default BookCard;