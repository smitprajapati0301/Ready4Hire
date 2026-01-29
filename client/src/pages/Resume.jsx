import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import Divider from "../components/ui/Divider";
import Panel from "../components/ui/Panel";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Resume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const sectionRef = useScrollAnimation(0, "fade-up");
  const uploadRef = useScrollAnimation(100, "scale-in");
  const resultRef = useScrollAnimation(100, "blur-in");

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only");
      setFile(null);
      setShowSuccess(false);
      return;
    }

    setError("");
    setFile(selectedFile);
    setShowSuccess(true);

    // Auto-hide success animation after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

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

      // DEBUG - Log the full response
      console.log("Full API response:", res);
      console.log("Response data:", res.data);
      console.log("Response data type:", typeof res.data);
      console.log("Response data keys:", Object.keys(res.data));
      console.log("ATS Score:", res.data.atsScore);
      console.log("Missing:", res.data.missing);
      console.log("Suggestions:", res.data.suggestions);

      setResult(res.data);
      console.log("Result state set to:", res.data);

      // Save resumeId and filename
      localStorage.setItem("latestResumeId", res.data._id);
      localStorage.setItem("latestResumeFile", file.name);

      // Scroll to results after a short delay to allow rendering
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error("Upload error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fileMeta = file
    ? `${file.name} • ${Math.round(file.size / 1024)} KB`
    : "PDF format recommended";

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0C2C55] via-[#296374] to-[#0C2C55]">
      <section ref={sectionRef} className="bg-linear-to-r from-[#0C2C55] to-[#296374] text-white opacity-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#629FAD]/20 blur-3xl animate-pulse" />
        <Container className="py-16 sm:py-20 relative">
          <div className="max-w-3xl space-y-6">
            <Badge variant="solid" className="bg-[#629FAD] text-[#0C2C55] hover:bg-[#7bb6c3]">
              📄 Resume Analyzer
            </Badge>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl leading-tight">
              Upload your resume and get<br />
              <span className="text-[#629FAD]">actionable insights.</span>
            </h1>
            <p className="text-[#EDEDCE]/80 text-lg leading-relaxed">
              We analyze your resume for ATS compatibility, missing sections,
              and tailored improvement tips. <span className="text-[#629FAD] font-semibold">Think of it as a spell-checker, but for your career.</span>
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <Card ref={uploadRef} className="p-8 sm:p-10 opacity-0 bg-white/10 backdrop-blur-lg border-[#629FAD]/30 hover:border-[#629FAD]/50 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-white">
                    Upload Resume
                  </p>
                  <p className="text-sm text-[#629FAD]">Step 1 of 2 (the easy part)</p>
                </div>
                <Badge variant="neutral" className="bg-[#629FAD]/20 text-[#629FAD] border-[#629FAD]/30">
                  📄 PDF only
                </Badge>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resume-upload').click()}
                className={`group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 relative overflow-hidden ${isDragging
                    ? "border-[#629FAD] bg-[#629FAD]/20 scale-105"
                    : file
                      ? "border-green-500 bg-green-500/10"
                      : "border-[#629FAD]/40 bg-[#296374]/20 hover:border-[#629FAD] hover:bg-[#629FAD]/10 hover:scale-105"
                  }`}
              >
                {/* Success Animation Overlay */}
                {showSuccess && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm animate-fade-up z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center animate-scale-in shadow-xl">
                        <FiCheckCircle size={40} className="text-white" />
                      </div>
                      <p className="text-white font-bold text-lg animate-fade-up">File uploaded! ✓</p>
                    </div>
                  </div>
                )}

                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${file ? "bg-green-500" : "bg-linear-to-br from-[#629FAD] to-[#296374]"
                  } text-white shadow-lg group-hover:scale-110 transition-all duration-300 pointer-events-none`}>
                  {file ? <FiCheckCircle size={28} /> : <FiUploadCloud size={28} />}
                </div>
                <div className="space-y-2 pointer-events-none">
                  <p className="text-base font-semibold text-white group-hover:text-[#629FAD] transition-colors duration-300">
                    {file
                      ? "✓ File ready to analyze!"
                      : isDragging
                        ? "Drop it like it's hot! 🔥"
                        : "Drop your resume here or click to browse"
                    }
                  </p>
                  <p className="text-sm text-[#EDEDCE]/70">{fileMeta}</p>
                  {!file && <p className="text-xs text-[#629FAD]/80 italic">No judgment, we've seen worse 😉</p>}
                  {file && <p className="text-xs text-green-400 font-semibold">Ready to go! Click "Analyze resume" below 👇</p>}
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    handleFileSelect(e.target.files[0]);
                    e.target.value = null;
                  }}
                />
              </div>

              {error && <p className="text-sm text-red-400 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30">{error}</p>}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleUpload}
                  disabled={loading || !file}
                  className="w-full sm:w-auto bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#7bb6c3] hover:to-[#3a7a8a] text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-[#629FAD]/50"
                >
                  {loading ? "🔍 Analyzing..." : "✨ Analyze resume"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-[#629FAD] bg-transparent text-[#629FAD] hover:bg-[#629FAD]/10"
                  onClick={() => navigate("/interview")}
                >
                  🎤 Go to interview
                </Button>
              </div>
            </div>
          </Card>

          <Panel title="What you'll receive" className="bg-white/10 backdrop-blur-lg border-[#629FAD]/30 text-[#EDEDCE]">
            <p className="flex items-center gap-2 text-[#EDEDCE]/80">📊 ATS score with clear ranking (no sugarcoating)</p>
            <p className="flex items-center gap-2 text-[#EDEDCE]/80">📝 Missing sections you should add (oops!)</p>
            <p className="flex items-center gap-2 text-[#EDEDCE]/80">🎯 Targeted suggestions to improve impact</p>
            <p className="flex items-center gap-2 text-[#EDEDCE]/80">✨ Extracted identity and skills highlights</p>
          </Panel>
        </div>

        {result && (
          <Card ref={resultRef} className="mt-10 p-8 sm:p-12 bg-white/10 backdrop-blur-lg border-[#629FAD]/30 hover:border-[#629FAD]/50 transition-all duration-300 animate-blur-in">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-[#629FAD] font-semibold uppercase tracking-wider">ATS Score</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-6xl font-bold text-white">
                      {result.atsScore}
                    </p>
                    <p className="text-xl text-[#EDEDCE]/60">/100</p>
                  </div>
                  <p className="text-sm text-[#EDEDCE]/70">
                    {result.atsScore >= 80 ? "🎉 Looking good!" : result.atsScore >= 60 ? "👍 Not bad, room for improvement" : "🚨 Time for a makeover!"}
                  </p>
                </div>
                <Badge variant="success" className="bg-green-500/20 text-green-400 border-green-500/30">
                  ✓ Analysis complete
                </Badge>
              </div>

              <Divider className="border-[#629FAD]/20" />

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">🚨</span> Missing Sections
                  </h4>
                  <ul className="space-y-3 text-base text-[#EDEDCE]/80">
                    {result.missing?.length > 0 ? (
                      result.missing.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#296374]/20 border border-[#629FAD]/20 hover:border-[#629FAD]/40 transition-colors duration-200">
                          <span className="text-red-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#629FAD] italic">All good! Nothing missing here 🎉</li>
                    )}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">💡</span> Suggestions
                  </h4>
                  <ul className="space-y-3 text-base text-[#EDEDCE]/80">
                    {result.suggestions?.length > 0 ? (
                      result.suggestions.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#296374]/20 border border-[#629FAD]/20 hover:border-[#629FAD]/40 transition-colors duration-200">
                          <span className="text-[#629FAD] font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#629FAD] italic">Looking perfect already! ✨</li>
                    )}
                  </ul>
                </div>
              </div>

              <Divider className="border-[#629FAD]/20" />

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">📋</span> Extracted Info
                </h4>
                <div className="grid gap-4 text-base sm:grid-cols-3">
                  <div className="p-4 rounded-lg bg-[#296374]/20 border border-[#629FAD]/20">
                    <p className="text-xs text-[#629FAD] font-semibold uppercase tracking-wider mb-2">Name</p>
                    <p className="text-white font-semibold">{result.name || "Not found"}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#296374]/20 border border-[#629FAD]/20">
                    <p className="text-xs text-[#629FAD] font-semibold uppercase tracking-wider mb-2">Email</p>
                    <p className="text-white font-semibold break-all">{result.email || "Not found"}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#296374]/20 border border-[#629FAD]/20">
                    <p className="text-xs text-[#629FAD] font-semibold uppercase tracking-wider mb-2">Skills</p>
                    <p className="text-white font-semibold">{result.skills?.join(", ") || "Not found"}</p>
                  </div>
                </div>
              </div>

              {/* Projects Section */}
              {result.projects && result.projects.length > 0 && (
                <>
                  <Divider className="border-[#629FAD]/20" />
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-2xl">💻</span> Projects
                    </h4>
                    <div className="grid gap-4">
                      {result.projects.map((project, index) => (
                        <div key={index} className="p-4 rounded-lg bg-[#296374]/20 border border-[#629FAD]/20 hover:border-[#629FAD]/40 transition-colors duration-200">
                          <p className="text-white font-semibold mb-1">{project.name || `Project ${index + 1}`}</p>
                          {project.description && <p className="text-[#EDEDCE]/70 text-sm mb-2">{project.description}</p>}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {project.technologies.map((tech, i) => (
                                <Badge key={i} className="bg-[#629FAD]/20 text-[#629FAD] border-[#629FAD]/30 text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[#629FAD] text-sm hover:underline">
                              View Project →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Education Section */}
              {result.education && result.education.length > 0 && (
                <>
                  <Divider className="border-[#629FAD]/20" />
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-2xl">🎓</span> Education
                    </h4>
                    <div className="grid gap-4">
                      {result.education.map((edu, index) => (
                        <div key={index} className="p-4 rounded-lg bg-[#296374]/20 border border-[#629FAD]/20">
                          <p className="text-white font-semibold">{edu.institution || `Institution ${index + 1}`}</p>
                          {edu.degree && <p className="text-[#EDEDCE]/80 text-sm">{edu.degree}</p>}
                          {edu.dates && <p className="text-[#629FAD] text-sm">{edu.dates}</p>}
                          {edu.details && <p className="text-[#EDEDCE]/70 text-sm mt-1">{edu.details}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Experience Section */}
              {result.experience && result.experience.length > 0 && (
                <>
                  <Divider className="border-[#629FAD]/20" />
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-2xl">💼</span> Experience
                    </h4>
                    <div className="grid gap-4">
                      {result.experience.map((exp, index) => (
                        <div key={index} className="p-4 rounded-lg bg-[#296374]/20 border border-[#629FAD]/20">
                          <p className="text-white font-semibold">{exp.title || `Position ${index + 1}`}</p>
                          {exp.company && <p className="text-[#EDEDCE]/80">{exp.company}</p>}
                          {exp.dates && <p className="text-[#629FAD] text-sm">{exp.dates}</p>}
                          {exp.description && exp.description.length > 0 && (
                            <ul className="mt-2 space-y-1 text-[#EDEDCE]/70 text-sm">
                              {exp.description.map((desc, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#629FAD] mt-1">•</span>
                                  <span>{desc}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button
                size="lg"
                onClick={() => navigate("/interview")}
                className="w-full sm:w-auto bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#7bb6c3] hover:to-[#3a7a8a] text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-[#629FAD]/50"
              >
                🎤 Start mock interview now
              </Button>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
}
