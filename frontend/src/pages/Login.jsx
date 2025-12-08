import { useState } from "react";
import { post } from "../components/api/apiClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const login = async () => {
    setErr("");
    const res = await post("/auth/login", { email, password });

    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.userId);
      window.location.href = "/";
    } else {
      setErr(res.error);
    }
  };

  const signup = async () => {
    setErr("");
    const res = await post("/auth/signup", {
      email,
      password,
      name: email.split("@")[0],
    });

    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.userId);
      window.location.href = "/";
    } else {
      setErr(res.error);
    }
  };

  return (
    <div>
      <h2>Login / Signup</h2>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      
      <button onClick={login}>Login</button>
      <button onClick={signup}>Signup</button>

      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
