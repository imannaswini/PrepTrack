import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function Questions() {
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    title: "",
    topic: "",
    difficulty: "Easy",
    status: "Pending",
    notes: ""
  });

  const token = localStorage.getItem("token");

  const recommended = [
    {
      title: "Two Sum",
      topic: "Arrays",
      difficulty: "Easy"
    },
    {
      title: "Binary Search",
      topic: "Searching",
      difficulty: "Easy"
    },
    {
      title: "Merge Intervals",
      topic: "Arrays",
      difficulty: "Medium"
    },
    {
      title: "Climbing Stairs",
      topic: "DP",
      difficulty: "Easy"
    },
    {
      title: "LRU Cache",
      topic: "Design",
      difficulty: "Hard"
    }
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await API.get("/questions", {
      headers: {
        authorization: token
      }
    });

    setQuestions(res.data);
  };

  const addQuestion = async (e) => {
    e.preventDefault();

    await API.post("/questions", form, {
      headers: {
        authorization: token
      }
    });

    setForm({
      title: "",
      topic: "",
      difficulty: "Easy",
      status: "Pending",
      notes: ""
    });

    fetchQuestions();
  };

  const addRecommended = async (item) => {
    await API.post(
      "/questions",
      {
        ...item,
        status: "Pending",
        notes: "Recommended for interview prep"
      },
      {
        headers: {
          authorization: token
        }
      }
    );

    fetchQuestions();
  };

  const deleteQuestion = async (id) => {
    await API.delete(`/questions/${id}`, {
      headers: {
        authorization: token
      }
    });

    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          Interview Prep Questions
        </h1>

        <Link
          to="/dashboard"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Dashboard
        </Link>
      </div>

      {/* Recommended Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Recommended Interview Questions
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {recommended.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {item.topic} | {item.difficulty}
                </p>
              </div>

              <button
                onClick={() => addRecommended(item)}
                className="bg-green-500 text-white px-3 py-2 rounded"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Add */}
      <form
        onSubmit={addQuestion}
        className="bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-4 mb-8"
      >
        <h2 className="text-2xl font-bold md:col-span-2">
          Add Custom Question
        </h2>

        <input
          className="border p-3 rounded"
          placeholder="Question Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="border p-3 rounded"
          placeholder="Topic"
          value={form.topic}
          onChange={(e) =>
            setForm({ ...form, topic: e.target.value })
          }
        />

        <select
          className="border p-3 rounded"
          value={form.difficulty}
          onChange={(e) =>
            setForm({
              ...form,
              difficulty: e.target.value
            })
          }
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <select
          className="border p-3 rounded"
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value
            })
          }
        >
          <option>Pending</option>
          <option>Solved</option>
        </select>

        <input
          className="border p-3 rounded md:col-span-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />

        <button className="bg-blue-500 text-white p-3 rounded md:col-span-2">
          Add Custom Question
        </button>
      </form>

      {/* My Questions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-purple-600">
          My Practice List
        </h2>

        <div className="grid gap-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{q.title}</h3>
                <p className="text-sm text-gray-600">
                  {q.topic} | {q.difficulty} | {q.status}
                </p>
                <p className="text-sm mt-1">{q.notes}</p>
              </div>

              <button
                onClick={() => deleteQuestion(q._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Questions;