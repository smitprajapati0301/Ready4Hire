import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Ready4Hire</h1>
      <p className="mb-6">AI Resume Analyzer & Interview Coach</p>
      <button
        onClick={() => navigate("/resume")}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Get Started
      </button>
    </div>
  );
}
