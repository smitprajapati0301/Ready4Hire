import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Resume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
  "http://localhost:3000/api/resume/upload",
  formData
);

setResult(res.data);

// DEBUG
console.log("Upload response:", res.data);

// Save resumeId
localStorage.setItem("latestResumeId", res.data._id);


    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const selected = e.target.files[0];

          if (!selected) return;

          if (selected.type !== "application/pdf") {
            setError("Please upload a PDF file only");
            setFile(null);
            e.target.value = null;
            return;
          }

          setError("");
          setFile(selected);
        }}
      />


      <button
        onClick={handleUpload}
        disabled={loading}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Analyzing..." : "Upload"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-8 border p-4 rounded">
          <h3 className="text-xl font-semibold">ATS Score: {result.atsScore}</h3>

          <div className="mt-4">
            <h4 className="font-semibold">Missing Sections</h4>
            <ul>
              {result.missing.map((m, i) => (
                <li key={i}>- {m}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Suggestions</h4>
            <ul>
              {result.suggestions.map((s, i) => (
                <li key={i}>- {s}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Extracted Info</h4>
            <p><b>Name:</b> {result.name}</p>
            <p><b>Email:</b> {result.email}</p>
            <p><b>Skills:</b> {result.skills.join(", ")}</p>
          </div>

          <button
            onClick={() => navigate("/interview")}
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full sm:w-auto"
          >
            Start Mock Interview
          </button>
        </div>
      )}
    </div>
  );
}
