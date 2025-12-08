import { useState } from "react";
import { post } from "../components/api/apiClient";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const save = async () => {
    setMsg("");
    await post("/expenses", { amount, category, note });
    setMsg("Expense added!");
    setAmount("");
    setCategory("");
    setNote("");
  };

  return (
    <div>
      <h2>Add Expense</h2>

      <input placeholder="Amount" value={amount}
        onChange={e => setAmount(e.target.value)} /><br />

      <input placeholder="Category" value={category}
        onChange={e => setCategory(e.target.value)} /><br />

      <input placeholder="Note" value={note}
        onChange={e => setNote(e.target.value)} /><br />

      <button onClick={save}>Save</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
