import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import Categories from "./pages/Categories";
import Predict from "./pages/Predict";
import Login from "./pages/Login";
import "./styles/main.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-expense"
            element={isAuthenticated ? <AddExpense /> : <Navigate to="/login" />}
          />
          <Route
            path="/expenses"
            element={isAuthenticated ? <Expenses /> : <Navigate to="/login" />}
          />
          <Route
            path="/categories"
            element={isAuthenticated ? <Categories /> : <Navigate to="/login" />}
          />
          <Route
            path="/predict"
            element={isAuthenticated ? <Predict /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;