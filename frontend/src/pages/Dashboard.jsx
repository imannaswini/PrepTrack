import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    pending: 0
  });

  const nav = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/questions/stats/all", {
        headers: {
          authorization: token
        }
      });

      setStats(res.data);
    } catch (error) {
      nav("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          PrepTrack Dashboard
        </h1>

        <div className="space-x-3">
          <Link
            to="/questions"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Questions
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">
            Total Questions
          </h2>
          <p className="text-4xl font-bold mt-3 text-blue-500">
            {stats.total}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">
            Solved
          </h2>
          <p className="text-4xl font-bold mt-3 text-green-500">
            {stats.solved}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">
            Pending
          </h2>
          <p className="text-4xl font-bold mt-3 text-red-500">
            {stats.pending}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;