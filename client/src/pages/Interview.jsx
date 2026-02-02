import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import {
  FiMessageSquare,
  FiZap,
  FiStar,
  FiChevronRight,
} from "react-icons/fi";

// Simple UUID generator
const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function Interview() {
  const { user } = useAuth();
  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [voiceMode, setVoiceMode] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const endRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Load resume data from localStorage
    const resumeId = localStorage.getItem("latestResumeId");
    const resumeFile = localStorage.getItem("latestResumeFile");
    if (resumeFile) {
      setResumeData({ fileName: resumeFile, id: resumeId });
    }
  }, []);

  // 🔧 EDIT: Speak function
  const speak = (text) => {
    if (!voiceMode) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!voiceMode) return;
    setIsRecording(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalText = "";
    let silenceTimer = null;

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setAnswer((finalText + interimTranscript).trim());

      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        recognition.stop();
        setIsRecording(false);
        sendAnswer(finalText.trim());
      }, 5000);
    };

    recognition.start();
  };

  const pushMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const startInterview = async () => {
    const resumeId = localStorage.getItem("latestResumeId");

    if (!resumeId) {
      alert("Please upload a resume first.");
      return;
    }

    try {
      setLoading(true);

      const idToken = localStorage.getItem("idToken");

      const res = await axios.post(
        `${BACKEND_URL}/api/interview/start`,
        {
          resumeId,
          domain: "Web Development",
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      setInterviewId(res.data.interviewId);
      setQuestion(res.data.question);
      pushMessage({
        id: generateId(),
        role: "ai",
        content: res.data.question,
        timestamp: new Date().toISOString(),
      });
      speak(res.data.question); // 🔧 EDIT: speak when received
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const parseScore = (feedbackText) => {
    const scoreMatch = feedbackText.match(/Score.*?(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : 5;
  };

  const isPassed = (feedbackText) => {
    const text = feedbackText.toLowerCase();
    return text.includes('pass') && !text.includes('fail');
  };

  const sendAnswer = async (textOverride) => {
    const finalAnswer = textOverride ?? answer;
    if (typeof finalAnswer !== 'string' || !finalAnswer.trim()) return;

    try {
      setLoading(true);

      pushMessage({
        id: generateId(),
        role: "user",
        content: finalAnswer,
        timestamp: new Date().toISOString(),
      });

      const idToken = localStorage.getItem("idToken");

      const res = await axios.post(
        `${BACKEND_URL}/api/interview/answer`,
        {
          interviewId,
          answer: finalAnswer,
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      setAnswer("");
      setQuestionCount(prev => prev + 1);

      if (res.data.done) {
        setFeedback(res.data.feedback);
        setQuestion("");
        // Don't push feedback to messages - will display in special card
      } else {
        setQuestion(res.data.question);
        pushMessage({
          id: generateId(),
          role: "ai",
          content: res.data.question,
          timestamp: new Date().toISOString(),
        });
        speak(res.data.question); // 🔧 EDIT
        if (voiceMode) startListening(); // 🔧 EDIT: auto listen in voice mode
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0C2C55 0%, #296374 100%)" }}>
      {/* Header with gradient overlay */}
      <div className="sticky top-16 z-30 border-b border-[#629FAD]/20 backdrop-blur-md bg-[#0C2C55]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#629FAD] to-[#296374] flex items-center justify-center">
              <FiMessageSquare className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Mock Interview</h1>
              <p className="text-xs text-[#629FAD]">Real-time AI feedback</p>
            </div>
          </div>

          {/* Question Counter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#EDEDCE] font-medium">Question</span>
            <div className="px-3 py-1 rounded-full bg-linear-to-r from-[#629FAD] to-[#296374] text-white text-sm font-semibold">
              {questionCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!interviewId ? (
          // Pre-interview screen
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main CTA */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-12 border border-[#629FAD]/30 hover:border-[#629FAD]/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#629FAD] to-[#296374] flex items-center justify-center">
                    <FiZap className="text-white text-xl" />
                  </div>
                  <span className="text-[#629FAD] font-semibold text-sm">READY TO PRACTICE?</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  Start Your Mock Interview
                </h2>
                <p className="text-[#EDEDCE]/80 text-lg mb-8">
                  Get real-time feedback from our AI interviewer. Practice common questions, refine your answers, and boost your confidence.
                </p>

                {/* Resume selection */}
                {resumeData && (
                  <div className="mb-8 p-4 rounded-xl bg-[#296374]/20 border border-[#629FAD]/30">
                    <p className="text-sm text-[#629FAD] font-medium mb-2">Using Resume:</p>
                    <p className="text-white font-semibold">{resumeData.fileName || "Resume uploaded"}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={startInterview}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#5A8D9B] hover:to-[#245566] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#629FAD]/20 disabled:opacity-50"
                  >
                    {loading ? "Starting..." : "Begin Interview"}
                  </button>

                  {/* Voice mode toggle */}
                  <button
                    onClick={() => setVoiceMode(!voiceMode)}
                    className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 border-2 flex items-center justify-center gap-2 ${voiceMode
                      ? "bg-[#629FAD]/20 border-[#629FAD] text-[#629FAD]"
                      : "bg-transparent border-[#629FAD]/30 text-[#EDEDCE] hover:border-[#629FAD]/50"
                      }`}
                  >
                    <FaMicrophone className="text-sm" />
                    Voice Mode
                  </button>
                </div>
              </div>
            </div>

            {/* Tips sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-[#629FAD]/20 sticky top-32">
                <div className="flex items-center gap-2 mb-4">
                  <FiStar className="text-[#629FAD]" />
                  <h3 className="text-white font-bold">Pro Tips</h3>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-[#EDEDCE]/80">
                    <span className="font-semibold text-[#629FAD]">STAR Method:</span> Situation, Task, Action, Result
                  </div>
                  <div className="text-sm text-[#EDEDCE]/80">
                    <span className="font-semibold text-[#629FAD]">Quantify:</span> Use specific metrics and numbers
                  </div>
                  <div className="text-sm text-[#EDEDCE]/80">
                    <span className="font-semibold text-[#629FAD]">Be Authentic:</span> Share genuine experiences
                  </div>
                  <div className="text-sm text-[#EDEDCE]/80">
                    <span className="font-semibold text-[#629FAD]">Listen:</span> Pause and let the AI respond
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // During interview
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat section */}
            <div className="lg:col-span-2">
              {/* Messages container */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-[#629FAD]/30 overflow-hidden flex flex-col h-150">
                {/* Messages area or Feedback Card */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {feedback ? (
                    // Show Feedback Card when interview is complete
                    <div className="flex justify-center items-center min-h-full">
                      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-[#629FAD]/30 max-w-2xl w-full shadow-2xl">
                        {/* Header with Pass/Fail Icon */}
                        <div className="flex flex-col items-center mb-6">
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isPassed(feedback)
                              ? 'bg-green-500/20 border-4 border-green-500'
                              : 'bg-red-500/20 border-4 border-red-500'
                            }`}>
                            {isPassed(feedback) ? (
                              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <h2 className={`text-2xl font-bold mb-2 ${isPassed(feedback) ? 'text-green-400' : 'text-red-400'
                            }`}>
                            Interview {isPassed(feedback) ? 'Passed' : 'Failed'}
                          </h2>
                        </div>

                        {/* Circular Progress Score */}
                        <div className="flex justify-center mb-8">
                          <div className="relative w-40 h-40">
                            <svg className="transform -rotate-90 w-40 h-40">
                              <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="#296374"
                                strokeWidth="12"
                                fill="none"
                                opacity="0.3"
                              />
                              <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke={isPassed(feedback) ? '#10b981' : '#ef4444'}
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 70}`}
                                strokeDashoffset={`${2 * Math.PI * 70 * (1 - parseScore(feedback) / 10)}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-5xl font-bold text-white">{parseScore(feedback)}</div>
                                <div className="text-sm text-[#EDEDCE]/60">out of 10</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Feedback Content */}
                        <div className="bg-[#0C2C55]/50 rounded-2xl p-6 mb-6 border border-[#629FAD]/20 max-h-96 overflow-y-auto">
                          <div className="text-[#EDEDCE] whitespace-pre-wrap text-sm leading-relaxed">
                            {feedback}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => window.location.href = '/resume'}
                          className="w-full px-6 py-4 bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#5A8D9B] hover:to-[#245566] text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#629FAD]/30"
                        >
                          Back to Dashboard
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Show regular messages when interview is in progress
                    <>
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#629FAD]/20 to-[#296374]/20 flex items-center justify-center mx-auto mb-4">
                              <FiMessageSquare className="text-[#629FAD] text-2xl" />
                            </div>
                            <p className="text-[#EDEDCE]/60">Waiting for first question...</p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message, idx) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <div
                              className={`max-w-xs sm:max-w-md px-4 py-3 rounded-lg border transition-all duration-200 ${message.role === "user"
                                ? "bg-linear-to-r from-[#629FAD] to-[#296374] border-[#629FAD]/50 text-white rounded-br-none"
                                : message.isFeedback
                                  ? "bg-[#296374]/20 border-[#629FAD]/30 text-[#EDEDCE] rounded-bl-none"
                                  : "bg-white/5 border-[#629FAD]/20 text-[#EDEDCE] rounded-bl-none"
                                }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <span className="text-xs opacity-60 mt-2 block">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}

                      {/* Typing indicator */}
                      {loading && interviewId && (
                        <div className="flex justify-start animate-fade-up">
                          <div className="px-4 py-3 rounded-lg bg-white/5 border border-[#629FAD]/20 rounded-bl-none">
                            <div className="flex gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#629FAD] animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-[#629FAD] animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 rounded-full bg-[#629FAD] animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={endRef} />
                    </>
                  )}
                </div>

                {/* Input area - hide when feedback is shown */}
                {!feedback && (
                  <div className="border-t border-[#629FAD]/20 p-4 bg-[#0C2C55]/50">
                    <div className="flex flex-col gap-3">\n                    {/* Voice mode indicator */}\n                    {voiceMode && isRecording && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-xs font-semibold text-red-500">Recording...</span>
                      </div>
                    )}

                      {/* Textarea */}
                      {!voiceMode ? (
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full px-4 py-3 bg-white/10 border border-[#629FAD]/30 rounded-lg text-[#EDEDCE] placeholder-[#629FAD]/50 focus:outline-none focus:border-[#629FAD] resize-none"
                          rows="3"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && e.ctrlKey) {
                              sendAnswer();
                            }
                          }}
                        />
                      ) : (
                        <div className="px-4 py-3 bg-white/10 border border-[#629FAD]/30 rounded-lg text-[#EDEDCE] min-h-22 flex items-center justify-center">
                          {answer || "Click 'Speak' to begin recording..."}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {voiceMode ? (
                          <>
                            <button
                              onClick={startListening}
                              disabled={loading || isRecording}
                              className="flex-1 px-4 py-3 bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#5A8D9B] hover:to-[#245566] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#629FAD]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <FaMicrophone className="text-sm" />
                              {isRecording ? "Recording..." : "Speak"}
                            </button>
                            <button
                              onClick={() => setVoiceMode(false)}
                              className="px-4 py-3 border border-[#629FAD]/30 text-[#EDEDCE] font-semibold rounded-lg hover:bg-white/5 transition-all duration-200"
                            >
                              Type
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => sendAnswer()}
                              disabled={!answer.trim() || loading}
                              className="flex-1 px-4 py-3 bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#5A8D9B] hover:to-[#245566] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#629FAD]/20 disabled:opacity-50"
                            >
                              Submit
                            </button>
                            {interviewId && (
                              <button
                                onClick={() => setVoiceMode(true)}
                                className="px-4 py-3 border border-[#629FAD]/30 text-[#EDEDCE] font-semibold rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center gap-2"
                              >
                                <FaMicrophone className="text-sm" />
                                Voice
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Progress */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-[#629FAD]/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#629FAD] to-[#296374] flex items-center justify-center">
                    <FiChevronRight className="text-white" />
                  </div>
                  <h3 className="text-white font-bold">Interview Progress</h3>
                </div>

                <div className="space-y-4">
                  {/* Question Counter */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#629FAD] font-semibold text-sm">Questions Answered</span>
                      <span className="text-[#EDEDCE] text-lg font-bold">{questionCount} / ~7</span>
                    </div>
                    <div className="w-full h-3 bg-[#296374]/30 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-linear-to-r from-[#629FAD] to-[#296374] transition-all duration-500 ease-out relative overflow-hidden"
                        style={{ width: `${Math.min((questionCount / 7) * 100, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${questionCount === 0 ? 'bg-gray-400' :
                          questionCount < 4 ? 'bg-yellow-400 animate-pulse' :
                            questionCount < 7 ? 'bg-blue-400 animate-pulse' :
                              'bg-green-400 animate-pulse'
                        }`}></div>
                      <span className="text-[#EDEDCE]/80">
                        {questionCount === 0 ? 'Not Started' :
                          questionCount < 4 ? 'Getting Started' :
                            questionCount < 7 ? 'In Progress' :
                              'Nearly Complete'}
                      </span>
                    </div>
                    <span className="text-[#629FAD] font-semibold">{Math.round((questionCount / 7) * 100)}%</span>
                  </div>

                  {/* Estimate */}
                  <div className="pt-3 border-t border-[#629FAD]/20">
                    <p className="text-xs text-[#EDEDCE]/60 text-center">
                      {questionCount < 7 ? `~${7 - questionCount} questions remaining` : 'Interview wrapping up!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Voice Mode Info */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-[#629FAD]/20">
                <div className="flex items-center gap-2 mb-4">
                  <FaMicrophone className="text-[#629FAD]" />
                  <h3 className="text-white font-bold">Voice Mode</h3>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setVoiceMode(!voiceMode)}
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${voiceMode
                      ? "bg-[#629FAD]/20 border border-[#629FAD] text-[#629FAD]"
                      : "bg-transparent border border-[#629FAD]/30 text-[#EDEDCE] hover:border-[#629FAD]/50"
                      }`}
                  >
                    {voiceMode ? "✓ Enabled" : "Disabled"}
                  </button>

                  <p className="text-xs text-[#EDEDCE]/60">
                    {voiceMode
                      ? "Speak naturally for 5 seconds. Auto-submit on silence."
                      : "Type your answers for more control."}
                  </p>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-[#629FAD]/20">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <FiStar className="text-[#629FAD]" />
                  Interview Tips
                </h3>

                <ul className="space-y-2 text-xs text-[#EDEDCE]/80">
                  <li className="flex gap-2">
                    <span className="text-[#629FAD] font-bold">•</span>
                    <span>Use concrete examples from your background</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#629FAD] font-bold">•</span>
                    <span>Show your impact with measurable results</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#629FAD] font-bold">•</span>
                    <span>Ask clarifying questions when unsure</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#629FAD] font-bold">•</span>
                    <span>Practice your delivery with confidence</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
