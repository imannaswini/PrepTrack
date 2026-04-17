import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", form);
    nav("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">
          Register
        </h1>

        <input
          className="border p-3 w-full rounded"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border p-3 w-full rounded"
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

        <button className="bg-green-500 text-white w-full p-3 rounded">
          Register
        </button>

        <p className="text-center">
          Already have account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;