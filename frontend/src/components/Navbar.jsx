import { Link } from "react-router-dom";

export default function Navbar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav style={{ padding: 10, background: "#eee" }}>
      <Link to="/">Dashboard</Link> |{" "}
      <Link to="/expenses">Expenses</Link> |{" "}
      <Link to="/add-expense">Add Expense</Link> |{" "}
      <Link to="/categories">Categories</Link> |{" "}
      <Link to="/predict">AI Predict</Link> |{" "}
      
      <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
    </nav>
  );
}
