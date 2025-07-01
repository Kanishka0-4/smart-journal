import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/entries/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.title) setTitle(data.title);
        if (data.text) setText(data.text);
      })
      .catch(() => setError("Failed to load entry"));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!text.trim() || !title.trim()) {
      setError("Title and text required");
      return;
    }

    const res = await fetch(`http://localhost:5000/api/entries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, text })
    });

    if (res.ok) {
      navigate("/dashboard");
    } else {
      setError("Failed to update entry");
    }
  };

  return (
    <div className="edit-entry-wrapper">
      <h2>Edit Entry</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Edit your thoughts..."
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">💾 Update</button>
        <button type="button" onClick={() => navigate("/dashboard")}>↩️ Cancel</button>
      </form>
    </div>
  );
}
