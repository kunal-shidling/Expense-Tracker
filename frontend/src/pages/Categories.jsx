// import { useState, useEffect } from "react";
// import { get, post } from "../components/api/apiClient";

// export default function Categories() {
//   const [name, setName] = useState("");
//   const [list, setList] = useState([]);

//   const load = async () => {
//     const res = await get("/categories");
//     setList(res);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const add = async () => {
//     await post("/categories", { name });
//     setName("");
//     load();
//   };

//   return (
//     <div>
//       <h2>Categories</h2>

//       <input
//         placeholder="New Category"
//         value={name}
//         onChange={e => setName(e.target.value)}
//       />
//       <button onClick={add}>Add</button>

//       <ul>
//         {list.map(c => <li key={c._id}>{c.name}</li>)}
//       </ul>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { get, post, patch, del } from "../components/api/apiClient";
import "../styles/Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      const data = await get("/categories");
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await post("/categories", { name });
      setName("");
      setSuccess("Category added successfully!");
      load();
    } catch (err) {
      setError(err.message || "Failed to add category");
    }
  };

  const update = async (id) => {
    setError("");
    setSuccess("");

    try {
      const result = await patch(`/categories/${id}`, { name: editName });
      setEditId(null);
      setEditName("");
      setSuccess(
        `Category updated! ${result.expensesUpdated || 0} expense(s) were also updated.`
      );
      load();
    } catch (err) {
      setError(err.message || "Failed to update category");
    }
  };

  const remove = async (id, categoryName) => {
    if (!window.confirm(`Delete category "${categoryName}"?`)) return;

    setError("");
    setSuccess("");

    try {
      await del(`/categories/${id}`);
      setSuccess("Category deleted successfully!");
      load();
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="categories-container">
      <h2>Manage Categories</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={add} className="category-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          required
        />
        <button type="submit">Add Category</button>
      </form>

      <div className="categories-list">
        {categories.length === 0 ? (
          <p className="no-data">No categories yet. Add one above!</p>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="category-item">
              {editId === cat._id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => update(cat._id)} className="save-btn">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditName("");
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="view-mode">
                  <div className="category-info">
                    <span className="category-name">{cat.name}</span>
                    <span className="expense-count">
                      {cat.expenseCount || 0} expense(s)
                    </span>
                  </div>
                  <div className="category-actions">
                    <button
                      onClick={() => {
                        setEditId(cat._id);
                        setEditName(cat.name);
                      }}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(cat._id, cat.name)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}