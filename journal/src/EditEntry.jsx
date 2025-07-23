import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditEntry.css";

export default function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // Load existing entry data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`http://localhost:5000/api/entries/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "");
        setText(data.text || "");
      })
      .catch(() => setError("Failed to load entry"));
  }, [id, navigate]);

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !text.trim()) {
      setError("Title and text are required");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/entries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, text }),
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        setError("Failed to update entry");
      }
    } catch {
      setError("Network error while updating");
    }
  };

  return (
    <div className="edit-entry-wrapper">
      <h2>Edit Entry</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          value={text}
          placeholder="Edit your thoughts..."
          onChange={(e) => setText(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button type="submit">💾 Update</button>
        <button type="button" onClick={() => navigate("/dashboard")}>
          ↩️ Cancel
        </button>
      </form>
    </div>
  );
}
