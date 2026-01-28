import { useState } from "react";
import axios from "axios";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

export default function Interview() {
  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const [voiceMode, setVoiceMode] = useState(false); // 🔧 EDIT: moved inside component

  // 🔧 EDIT: Speak function
  const speak = (text) => {
    if (!voiceMode) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  // 🔧 EDIT: Voice input with 5s silence end
  const startListening = () => {
    if (!voiceMode) return;

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

      // Only process FINAL results, ignore interim results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          // This is a final result - append it to our accumulated text
          finalText += event.results[i][0].transcript + " ";
        } else {
          // This is interim - show it in UI but don't commit yet
          interimTranscript += event.results[i][0].transcript;
        }
      }

      // Only skip for filler sounds if it's a final result
      const cleaned = interimTranscript.trim().toLowerCase();
      if (["um", "uh", "hmm", "huh"].includes(cleaned) && !interimTranscript) return;

      // Update UI with accumulated final + current interim
      setAnswer((finalText + interimTranscript).trim());

      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        recognition.stop();
        sendAnswer(finalText.trim()); // auto-submit
      }, 5000);
    };

    recognition.start();
  };

  const startInterview = async () => {
    const resumeId = localStorage.getItem("latestResumeId");

    if (!resumeId) {
      alert("Please upload a resume first.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/api/interview/start", {
        resumeId,
        domain: "Web Development",
      });

      setInterviewId(res.data.interviewId);
      setQuestion(res.data.question);
      speak(res.data.question); // 🔧 EDIT: speak when received
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const sendAnswer = async (textOverride) => {
    const finalAnswer = textOverride ?? answer;
    if (!finalAnswer.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/api/interview/answer", {
        interviewId,
        answer: finalAnswer,
      });

      setAnswer("");

      if (res.data.done) {
        setFeedback(res.data.feedback);
        setQuestion("");
      } else {
        setQuestion(res.data.question);
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
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mock Interview</h1>

        {!interviewId && (
          <button
            onClick={startInterview}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        )}

        {question && (
          <div className="bg-white p-6 rounded-xl border mb-4">
            <p className="font-medium">{question}</p>
          </div>
        )}

        {/* 🔧 EDIT: Mic Toggle */}
        <button
          onClick={() => setVoiceMode(!voiceMode)}
          className={`p-3 rounded-full transition mb-4 ${voiceMode ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          title={voiceMode ? "Voice Mode On" : "Voice Mode Off"}
        >
          {voiceMode ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
        </button>

        {interviewId && !feedback && question && (
          <div className="space-y-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-4 border rounded-lg"
              rows="4"
              placeholder="Type your answer..."
              disabled={voiceMode} // 🔧 EDIT: lock in voice mode
            />

            {!voiceMode && (
              <button
                onClick={() => sendAnswer()}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
              >
                {loading ? "Thinking..." : "Submit Answer"}
              </button>
            )}

            {voiceMode && (
              <button
                onClick={startListening}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg"
              >
                Speak Answer
              </button>
            )}
          </div>
        )}

        {feedback && (
          <div className="bg-white p-6 rounded-xl border mt-6">
            <h2 className="text-xl font-semibold mb-3">Interview Feedback</h2>
            <p className="text-slate-700 whitespace-pre-line">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}
