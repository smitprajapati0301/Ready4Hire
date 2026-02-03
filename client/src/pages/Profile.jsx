import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    FiUser, FiFileText, FiMic, FiCalendar, FiAward, FiClock,
    FiChevronDown, FiChevronUp, FiBriefcase, FiBook, FiCode,
    FiAlertCircle, FiCheckCircle, FiMessageSquare
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Profile() {
    const { user } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for expanded cards
    const [expandedResumes, setExpandedResumes] = useState({});
    const [expandedInterviews, setExpandedInterviews] = useState({});

    const sectionRef = useScrollAnimation(0, "fade-up");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idToken = localStorage.getItem("idToken");
                if (!idToken) return;

                const headers = { Authorization: `Bearer ${idToken}` };

                const [resumeRes, interviewRes] = await Promise.all([
                    axios.get(`${BACKEND_URL}/api/resume/user`, { headers }),
                    axios.get(`${BACKEND_URL}/api/interview/user`, { headers })
                ]);

                setResumes(resumeRes.data);
                setInterviews(interviewRes.data);
            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [BACKEND_URL]);

    const toggleResume = (id) => {
        setExpandedResumes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleInterview = (id) => {
        setExpandedInterviews(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getInitials = (name) => {
        return name
            ? name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
            : "??";
    };

    const getAverageATS = () => {
        if (!resumes.length) return 0;
        const sum = resumes.reduce((acc, curr) => acc + (curr.atsScore || 0), 0);
        return Math.round(sum / resumes.length);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#0C2C55] via-[#296374] to-[#0C2C55]">
            <Container className="py-24 sm:py-32">
                <div ref={sectionRef} className="space-y-8">

                    {/* User Profile Header - Expanded */}
                    <Card className="p-8 bg-gradient-to-br from-[#296374]/90 to-[#0C2C55]/95 backdrop-blur-xl border-2 border-[#629FAD]/40 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FiUser size={120} className="text-[#629FAD]" />
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
                            <div className="h-28 w-28 rounded-full bg-[#629FAD] flex items-center justify-center text-[#0C2C55] text-4xl font-bold shadow-lg border-4 border-[#0C2C55] shrink-0">
                                {user ? getInitials(user.name || user.displayName) : <FiUser />}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white tracking-tight">
                                        {user?.name || user?.displayName || "User Profile"}
                                    </h1>
                                    <p className="text-[#EDEDCE]/80 text-lg flex items-center gap-2 mt-1">
                                        <span className="text-[#629FAD]">@</span> {user?.email}
                                    </p>
                                    <p className="text-[#EDEDCE]/60 text-sm flex items-center gap-2 mt-1">
                                        <FiCalendar className="text-[#629FAD]" />
                                        Member since {user?.createdAt ? formatDate(user.createdAt) : formatDate(new Date())}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="px-4 py-2 rounded-lg bg-[#0C2C55]/50 border border-[#629FAD]/30 text-center">
                                        <p className="text-2xl font-bold text-white">{resumes.length}</p>
                                        <p className="text-xs text-[#629FAD] uppercase tracking-wider">Resumes</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-lg bg-[#0C2C55]/50 border border-[#629FAD]/30 text-center">
                                        <p className="text-2xl font-bold text-white">{interviews.length}</p>
                                        <p className="text-xs text-[#629FAD] uppercase tracking-wider">Interviews</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-lg bg-[#0C2C55]/50 border border-[#629FAD]/30 text-center">
                                        <p className="text-2xl font-bold text-white">{getAverageATS()}</p>
                                        <p className="text-xs text-[#629FAD] uppercase tracking-wider">Avg Score</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Content Grid */}
                    <div className="grid gap-8 lg:grid-cols-2">

                        {/* Resumes Section - Detailed */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <span className="text-[#629FAD]"><FiFileText /></span> Resume History
                                </h2>
                                <Link to="/resume" className="text-sm font-semibold text-[#629FAD] hover:text-white transition-colors border border-[#629FAD]/30 px-3 py-1 rounded-full hover:bg-[#629FAD]/20">
                                    + Upload New
                                </Link>
                            </div>

                            <div className="space-y-5">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-pulse flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-[#629FAD]/20 border-2 border-[#629FAD]/40"></div>
                                            <p className="text-[#EDEDCE]/60 text-sm">Loading resumes...</p>
                                        </div>
                                    </div>
                                ) : resumes.length > 0 ? (
                                    resumes.map((resume) => (
                                        <Card key={resume._id} className="overflow-hidden bg-gradient-to-br from-[#0C2C55]/80 to-[#296374]/60 backdrop-blur-md border-2 border-[#629FAD]/20 hover:border-[#629FAD]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#629FAD]/10 group">
                                            {/* Resume Header */}
                                            <div
                                                className="p-5 cursor-pointer flex justify-between items-start hover:bg-white/5 transition-colors duration-200"
                                                onClick={() => toggleResume(resume._id)}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="h-10 w-10 rounded-lg bg-[#629FAD]/20 flex items-center justify-center group-hover:bg-[#629FAD]/30 transition-colors">
                                                            <FiFileText className="text-[#629FAD]" size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-white text-lg group-hover:text-[#629FAD] transition-colors">
                                                                {resume.name || "Resume (No Name Detected)"}
                                                            </h3>
                                                            <p className="text-xs text-[#EDEDCE]/60 flex items-center gap-1.5 mt-0.5">
                                                                <FiCalendar size={12} /> {formatDate(resume.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <div className="flex items-baseline gap-1 justify-end">
                                                            <span className="text-2xl font-bold text-white">{resume.atsScore || 0}</span>
                                                            <span className="text-xs text-[#EDEDCE]/50">/100</span>
                                                        </div>
                                                        <Badge
                                                            className={`text-xs mt-1 ${resume.atsScore >= 70 ? 'bg-green-500/20 text-green-300 border-green-500/30' : resume.atsScore >= 50 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}
                                                        >
                                                            {resume.atsScore >= 70 ? 'Good' : resume.atsScore >= 50 ? 'Fair' : 'Needs Work'}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-[#629FAD] group-hover:scale-110 transition-transform">
                                                        {expandedResumes[resume._id] ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            {expandedResumes[resume._id] && (
                                                <div className="bg-[#0C2C55]/40 border-t border-[#629FAD]/20">
                                                    <div className="p-6 space-y-6">

                                                        {/* Contact Info */}
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <FiUser className="text-[#629FAD]" size={16} />
                                                            <span className="text-[#EDEDCE]/70">Contact:</span>
                                                            <span className="text-white font-medium">{resume.email || "N/A"}</span>
                                                        </div>

                                                        {/* Skills */}
                                                        <div className="bg-white/5 rounded-xl p-4 border border-[#629FAD]/10">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <FiCode className="text-[#629FAD]" size={16} />
                                                                <p className="text-sm text-[#629FAD] font-bold">Skills & Technologies</p>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {resume.skills?.length > 0 ? (
                                                                    resume.skills.map((skill, i) => (
                                                                        <Badge key={i} className="text-xs bg-[#629FAD]/15 text-[#629FAD] border border-[#629FAD]/30 hover:bg-[#629FAD]/25 transition-colors">
                                                                            {skill}
                                                                        </Badge>
                                                                    ))
                                                                ) : <p className="text-sm text-[#EDEDCE]/50 italic">No skills detected</p>}
                                                            </div>
                                                        </div>

                                                        {/* Education */}
                                                        {resume.education?.length > 0 && (
                                                            <div className="bg-white/5 rounded-xl p-4 border border-[#629FAD]/10">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <FiBook className="text-[#629FAD]" size={16} />
                                                                    <p className="text-sm text-[#629FAD] font-bold">Education</p>
                                                                </div>
                                                                <div className="space-y-4">
                                                                    {resume.education.map((edu, i) => (
                                                                        <div key={i} className="pl-4 border-l-2 border-[#629FAD]/40 hover:border-[#629FAD] transition-colors">
                                                                            <p className="text-white font-bold text-sm">{edu.institution}</p>
                                                                            <p className="text-[#EDEDCE]/90 text-xs mt-0.5">{edu.degree}</p>
                                                                            <p className="text-[#629FAD]/80 text-xs mt-0.5">{edu.dates}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Experience */}
                                                        {resume.experience?.length > 0 && (
                                                            <div className="bg-white/5 rounded-xl p-4 border border-[#629FAD]/10">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <FiBriefcase className="text-[#629FAD]" size={16} />
                                                                    <p className="text-sm text-[#629FAD] font-bold">Work Experience</p>
                                                                </div>
                                                                <div className="space-y-4">
                                                                    {resume.experience.map((exp, i) => (
                                                                        <div key={i} className="pl-4 border-l-2 border-[#629FAD]/40 hover:border-[#629FAD] transition-colors">
                                                                            <p className="text-white font-bold text-sm">{exp.title}</p>
                                                                            <p className="text-[#EDEDCE]/90 text-xs font-medium mt-0.5">{exp.company}</p>
                                                                            <p className="text-[#629FAD]/80 text-xs mt-0.5">{exp.dates}</p>
                                                                            {exp.description?.length > 0 && (
                                                                                <p className="text-[#EDEDCE]/70 text-xs mt-2 line-clamp-2">{exp.description[0]}</p>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* AI Analysis */}
                                                        <div className="bg-gradient-to-br from-[#629FAD]/10 to-[#296374]/10 rounded-xl p-4 border border-[#629FAD]/20">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <FiAlertCircle className="text-[#629FAD]" size={16} />
                                                                <p className="text-sm text-[#629FAD] font-bold">AI Analysis</p>
                                                            </div>

                                                            <div className="space-y-3">
                                                                {resume.missing?.length > 0 ? (
                                                                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                                                        <p className="text-xs text-red-300 font-bold mb-2 flex items-center gap-1.5">
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                                                                            Missing Sections
                                                                        </p>
                                                                        <ul className="space-y-1.5">
                                                                            {resume.missing.map((m, i) => (
                                                                                <li key={i} className="text-xs text-[#EDEDCE]/80 pl-3 border-l-2 border-red-400/30">{m}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                                                                        <p className="text-xs text-green-300 font-bold flex items-center gap-1.5">
                                                                            <FiCheckCircle size={14} /> All sections present!
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {resume.suggestions?.length > 0 && (
                                                                    <div className="bg-[#629FAD]/10 rounded-lg p-3 border border-[#629FAD]/20">
                                                                        <p className="text-xs text-[#629FAD] font-bold mb-2">💡 Suggestions</p>
                                                                        <ul className="space-y-1.5">
                                                                            {resume.suggestions.slice(0, 3).map((s, i) => (
                                                                                <li key={i} className="text-xs text-[#EDEDCE]/80 pl-3 border-l-2 border-[#629FAD]/30">{s}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="p-8 bg-[#0C2C55]/30 border border-[#629FAD]/10 text-center flex flex-col items-center gap-4 border-dashed">
                                        <FiFileText size={40} className="text-[#629FAD]/40" />
                                        <p className="text-[#EDEDCE]/60">No resumes analyzed yet.</p>
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Interviews Section - Detailed */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <span className="text-[#629FAD]"><FiAward /></span> Interview History
                                </h2>
                                <Link to="/interview" className="text-sm font-semibold text-[#629FAD] hover:text-white transition-colors border border-[#629FAD]/30 px-3 py-1 rounded-full hover:bg-[#629FAD]/20">
                                    + Start Mock
                                </Link>
                            </div>

                            <div className="space-y-5">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-pulse flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-[#629FAD]/20 border-2 border-[#629FAD]/40"></div>
                                            <p className="text-[#EDEDCE]/60 text-sm">Loading interviews...</p>
                                        </div>
                                    </div>
                                ) : interviews.length > 0 ? (
                                    interviews.map((interview) => (
                                        <Card key={interview._id} className="overflow-hidden bg-gradient-to-br from-[#0C2C55]/80 to-[#296374]/60 backdrop-blur-md border-2 border-[#629FAD]/20 hover:border-[#629FAD]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#629FAD]/10 group">
                                            {/* Interview Header */}
                                            <div
                                                className="p-5 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                                                onClick={() => toggleInterview(interview._id)}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="h-10 w-10 rounded-lg bg-[#629FAD]/20 flex items-center justify-center group-hover:bg-[#629FAD]/30 transition-colors">
                                                            <FiMic className="text-[#629FAD]" size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-white text-lg group-hover:text-[#629FAD] transition-colors">
                                                                {interview.domain || "General Mock Interview"}
                                                            </h3>
                                                            <p className="text-xs text-[#EDEDCE]/60 flex items-center gap-1.5 mt-0.5">
                                                                <FiClock size={12} /> {formatDate(interview.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge className={interview.feedback ? "bg-green-500/20 text-green-300 border-green-500/30 text-xs" : "bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"}>
                                                            {interview.feedback ? "✓ Completed" : "⏱ In Progress"}
                                                        </Badge>
                                                        <div className="text-[#629FAD] group-hover:scale-110 transition-transform">
                                                            {expandedInterviews[interview._id] ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-[#EDEDCE]/70">
                                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10">{interview.questions?.length || 0} Questions</span>
                                                    {interview.resumeId && (
                                                        <span className="flex items-center gap-1.5">
                                                            <FiFileText size={12} className="text-[#629FAD]" />
                                                            <span className="text-[#629FAD] font-medium">{interview.resumeId.name}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            {expandedInterviews[interview._id] && (
                                                <div className="bg-[#0C2C55]/40 border-t border-[#629FAD]/20">
                                                    <div className="p-6 space-y-5">

                                                        {/* Feedback Section */}
                                                        {interview.feedback && (
                                                            <div className="bg-gradient-to-br from-green-500/10 to-[#629FAD]/10 p-5 rounded-xl border border-green-500/30">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <FiCheckCircle className="text-green-400" size={18} />
                                                                    <p className="text-sm font-bold text-white">Performance Evaluation</p>
                                                                </div>
                                                                <div className="bg-[#0C2C55]/50 rounded-lg p-4 border border-white/10">
                                                                    <div className="text-sm text-[#EDEDCE]/90 whitespace-pre-line leading-relaxed">
                                                                        {interview.feedback}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Transcript / Questions */}
                                                        {interview.questions?.length > 0 && (
                                                            <div className="bg-white/5 rounded-xl p-4 border border-[#629FAD]/10">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <FiMessageSquare className="text-[#629FAD]" size={16} />
                                                                    <p className="text-sm text-[#629FAD] font-bold">Interview Transcript</p>
                                                                </div>
                                                                <div className="space-y-4">
                                                                    {interview.questions.slice(0, 3).map((q, i) => (
                                                                        <div key={i} className="bg-[#0C2C55]/50 rounded-lg p-4 border border-white/10">
                                                                            <div className="flex items-start gap-2 mb-2">
                                                                                <span className="text-[#629FAD] font-bold text-xs">Q{i + 1}:</span>
                                                                                <p className="text-white text-sm font-medium flex-1">{q}</p>
                                                                            </div>
                                                                            {interview.answers && interview.answers[i] ? (
                                                                                <div className="pl-5 border-l-2 border-[#629FAD]/30 mt-2">
                                                                                    <p className="text-[#EDEDCE]/80 text-xs italic">
                                                                                        "{interview.answers[i].length > 120 ? interview.answers[i].substring(0, 120) + "..." : interview.answers[i]}"
                                                                                    </p>
                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-[#EDEDCE]/40 text-xs pl-5 italic">No answer recorded</p>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                    {interview.questions.length > 3 && (
                                                                        <p className="text-xs text-[#629FAD] text-center py-2 bg-[#629FAD]/5 rounded-lg border border-[#629FAD]/10">
                                                                            + {interview.questions.length - 3} more questions in full transcript
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {!interview.feedback && (
                                                            <div className="text-center pt-2">
                                                                <Link to="/interview" className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#629FAD] to-[#296374] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#629FAD]/30 transition-all hover:scale-105">
                                                                    <FiMic size={16} />
                                                                    Continue Interview
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="p-8 bg-[#0C2C55]/30 border border-[#629FAD]/10 text-center flex flex-col items-center gap-4 border-dashed">
                                        <FiAward size={40} className="text-[#629FAD]/40" />
                                        <p className="text-[#EDEDCE]/60">No interviews started.</p>
                                    </Card>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </Container>
        </div>
    );
}
