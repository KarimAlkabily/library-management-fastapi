import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import BooksList from "./components/BooksList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/books" element={<BooksList />} />
    </Routes>
  );
}

export default App;