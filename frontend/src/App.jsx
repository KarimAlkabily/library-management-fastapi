import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import BooksList from "./components/BooksList";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./components/History";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <BooksList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;