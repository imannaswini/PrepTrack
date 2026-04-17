import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      nav("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <input
          className="border p-3 w-full rounded"
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="border p-3 w-full rounded"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="bg-blue-500 text-white w-full p-3 rounded hover:bg-blue-600">
          Login
        </button>

        <p className="text-center">
          No account?{" "}
          <Link
            to="/register"
            className="text-blue-500"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;