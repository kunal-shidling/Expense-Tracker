import { useEffect, useState } from "react";
import { get, del } from "../components/api/apiClient";

export default function Expenses() {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await get("/expenses");
    setList(res);
  };

  const remove = async (id) => {
    await del(`/expenses/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Your Expenses</h2>

      {list.map(e => (
        <div key={e._id} style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
          <p><b>Category:</b> {e.category}</p>
          <p><b>Amount:</b> ₹{e.amount}</p>
          <p><b>Note:</b> {e.note}</p>
          <button onClick={() => remove(e._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
