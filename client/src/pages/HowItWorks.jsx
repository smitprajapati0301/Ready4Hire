import { FiUpload, FiCheckCircle, FiMic, FiAward, FiUser, FiDatabase, FiCpu, FiServer, FiLock, FiZap, FiTrendingUp, FiArrowRight, FiArrowDown } from "react-icons/fi";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function HowItWorks() {
  const heroRef = useScrollAnimation(0, "fade-up");
  const flowRef = useScrollAnimation(100, "fade-up");
  const archRef = useScrollAnimation(100, "fade-up");
  const featuresRef = useScrollAnimation(100, "fade-up");
  const stepsRef = useScrollAnimation(100, "fade-up");

  const workflowSteps = [
    { icon: FiUser, title: "Sign Up", description: "Create your account in seconds" },
    { icon: FiUpload, title: "Upload Resume", description: "Drop your PDF resume" },
    { icon: FiCpu, title: "AI Analysis", description: "Get instant ATS score & insights" },
    { icon: FiDatabase, title: "Data Storage", description: "Resume securely stored" },
    { icon: FiMic, title: "Mock Interview", description: "AI generates questions based on your resume" },
    { icon: FiCheckCircle, title: "Answer Questions", description: "Respond via text or voice" },
    { icon: FiAward, title: "Get Feedback", description: "Receive detailed performance evaluation" },
    { icon: FiTrendingUp, title: "Dashboard", description: "Track progress & improve" },
  ];

  const architectureLayers = [
    {
      title: "Frontend Layer",
      tech: "React + Vite + Tailwind CSS",
      icon: FiUser,
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
      description: "Modern, responsive UI with real-time updates"
    },
    {
      title: "API Layer",
      tech: "Node.js + Express.js",
      icon: FiServer,
      color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
      description: "RESTful APIs with Firebase authentication"
    },
    {
      title: "AI Engine",
      tech: "LLM Integration (Groq/Gemini)",
      icon: FiCpu,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
      description: "Natural language processing for resume & interviews"
    },
    {
      title: "Database",
      tech: "MongoDB Atlas",
      icon: FiDatabase,
      color: "from-orange-500/20 to-red-500/20 border-orange-500/30",
      description: "Secure cloud storage for user data"
    },
  ];

  const features = [
    {
      icon: FiCpu,
      title: "AI Resume Analyzer",
      description: "Advanced algorithms scan your resume for ATS compatibility, missing sections, and improvement opportunities.",
      color: "bg-blue-500/10 border-blue-500/30 text-blue-400"
    },
    {
      icon: FiZap,
      title: "Adaptive Interviews",
      description: "Questions dynamically adjust based on your answers—easier if you struggle, harder if you excel.",
      color: "bg-purple-500/10 border-purple-500/30 text-purple-400"
    },
    {
      icon: FiMic,
      title: "Voice-Enabled",
      description: "Practice speaking your answers just like a real interview. Text input also supported.",
      color: "bg-green-500/10 border-green-500/30 text-green-400"
    },
    {
      icon: FiAward,
      title: "Detailed Feedback",
      description: "Get constructive criticism on every answer with actionable tips to improve your performance.",
      color: "bg-orange-500/10 border-orange-500/30 text-orange-400"
    },
    {
      icon: FiLock,
      title: "Secure Accounts",
      description: "Firebase authentication ensures your data is encrypted and protected at all times.",
      color: "bg-red-500/10 border-red-500/30 text-red-400"
    },
    {
      icon: FiTrendingUp,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and interview history.",
      color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
    },
  ];

  const userJourney = [
    {
      step: 1,
      title: "Sign Up / Login",
      description: "Create your account using email or Google Sign-In. Your credentials are securely managed by Firebase.",
      icon: FiUser,
      color: "text-blue-400"
    },
    {
      step: 2,
      title: "Upload Resume",
      description: "Drop your PDF resume and let our AI extract key information: skills, education, experience, projects.",
      icon: FiUpload,
      color: "text-green-400"
    },
    {
      step: 3,
      title: "Get AI Insights",
      description: "Receive an ATS score (0-100), identify missing sections, and get personalized suggestions to improve.",
      icon: FiCpu,
      color: "text-purple-400"
    },
    {
      step: 4,
      title: "Take Mock Interview",
      description: "Choose a domain (e.g., Frontend, Backend, Data Science) and start answering AI-generated questions.",
      icon: FiMic,
      color: "text-orange-400"
    },
    {
      step: 5,
      title: "Receive Feedback",
      description: "After 8 questions, get comprehensive feedback with strengths, weaknesses, and a performance score.",
      icon: FiAward,
      color: "text-yellow-400"
    },
    {
      step: 6,
      title: "Improve & Retry",
      description: "Review past interviews in your dashboard, track progress, and keep practicing until you're interview-ready.",
      icon: FiTrendingUp,
      color: "text-cyan-400"
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0C2C55] via-[#296374] to-[#0C2C55]">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden opacity-0 bg-gradient-to-r from-[#0C2C55] to-[#296374] text-white py-20 border-b border-[#629FAD]/20">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#629FAD]/20 blur-3xl animate-pulse" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-[#629FAD]/20 text-[#629FAD] border-[#629FAD]/30 mx-auto">
              🤖 AI-Powered Career Platform
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              How <span className="text-[#629FAD]">Ready4Hire</span> Works
            </h1>
            <p className="text-xl text-[#EDEDCE]/80 max-w-2xl mx-auto leading-relaxed">
              From resume analysis to interview mastery—discover how our AI-powered platform transforms your job search journey into a data-driven success story.
            </p>
          </div>
        </Container>
      </section>

      {/* Workflow Chart Section */}
      <section ref={flowRef} className="py-20 opacity-0">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Complete Workflow</h2>
            <p className="text-[#EDEDCE]/70 max-w-2xl mx-auto">
              Follow the journey from resume upload to becoming interview-ready
            </p>
          </div>

          {/* Desktop: Horizontal Flow */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#629FAD]/20 via-[#629FAD]/50 to-[#629FAD]/20 -translate-y-1/2" />

              <div className="grid grid-cols-4 gap-8 relative z-10">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <Card className="w-full p-6 bg-gradient-to-br from-[#0C2C55]/80 to-[#296374]/60 backdrop-blur-xl border-2 border-[#629FAD]/30 hover:border-[#629FAD]/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#629FAD]/20 relative group">
                        <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-[#629FAD] text-white flex items-center justify-center text-sm font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div className="h-14 w-14 rounded-full bg-[#629FAD]/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-[#629FAD]/30 transition-colors">
                          <Icon className="text-[#629FAD]" size={28} />
                        </div>
                        <h3 className="text-white font-bold text-center mb-2">{step.title}</h3>
                        <p className="text-[#EDEDCE]/70 text-xs text-center">{step.description}</p>
                      </Card>
                      {index < workflowSteps.length - 1 && (
                        <div className="absolute top-20 right-0 transform translate-x-1/2">
                          <FiArrowRight className="text-[#629FAD]" size={24} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Vertical Flow */}
          <div className="lg:hidden space-y-6">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="p-6 bg-gradient-to-br from-[#0C2C55]/80 to-[#296374]/60 backdrop-blur-xl border-2 border-[#629FAD]/30 hover:border-[#629FAD]/60 transition-all duration-300 relative">
                    <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-[#629FAD] text-white flex items-center justify-center text-lg font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-[#629FAD]/20 flex items-center justify-center shrink-0">
                        <Icon className="text-[#629FAD]" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold mb-1">{step.title}</h3>
                        <p className="text-[#EDEDCE]/70 text-sm">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                  {index < workflowSteps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <FiArrowDown className="text-[#629FAD]" size={24} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Architecture Section */}
      <section ref={archRef} className="py-20 bg-[#0C2C55]/50 opacity-0">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">System Architecture</h2>
            <p className="text-[#EDEDCE]/70 max-w-2xl mx-auto">
              Built on modern, scalable technologies for reliability and performance
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {architectureLayers.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <div key={index} className="relative">
                  <Card className={`p-6 bg-gradient-to-br ${layer.color} backdrop-blur-xl border-2 hover:scale-105 transition-all duration-300`}>
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Icon className="text-white" size={32} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-xl mb-1">{layer.title}</h3>
                        <p className="text-[#629FAD] text-sm font-mono mb-2">{layer.tech}</p>
                        <p className="text-[#EDEDCE]/80 text-sm">{layer.description}</p>
                      </div>
                    </div>
                  </Card>
                  {index < architectureLayers.length - 1 && (
                    <div className="flex justify-center py-3">
                      <FiArrowDown className="text-[#629FAD] animate-pulse" size={28} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 opacity-0">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-[#EDEDCE]/70 max-w-2xl mx-auto">
              Cutting-edge capabilities designed to give you a competitive edge
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className={`p-6 bg-gradient-to-br from-[#0C2C55]/80 to-[#296374]/60 backdrop-blur-xl border-2 ${feature.color} hover:scale-105 transition-all duration-300 hover:shadow-xl group`}>
                  <div className={`h-12 w-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-[#EDEDCE]/70 text-sm leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* User Journey Section */}
      <section ref={stepsRef} className="py-20 bg-[#0C2C55]/50 opacity-0">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Your Journey to Success</h2>
            <p className="text-[#EDEDCE]/70 max-w-2xl mx-auto">
              Six simple steps to transform from job seeker to interview expert
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {userJourney.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex gap-6 group">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`h-14 w-14 rounded-full bg-gradient-to-br from-[#629FAD] to-[#296374] flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {item.step}
                    </div>
                    {index < userJourney.length - 1 && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-[#629FAD]/50 to-transparent mt-2" />
                    )}
                  </div>
                  <Card className="flex-1 p-6 bg-gradient-to-br from-[#0C2C55]/80 to-[#296374]/60 backdrop-blur-xl border-2 border-[#629FAD]/30 hover:border-[#629FAD]/60 transition-all duration-300 group-hover:translate-x-2">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                        <p className="text-[#EDEDCE]/80 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-[#629FAD]/20">
        <Container>
          <Card className="p-12 bg-gradient-to-r from-[#0C2C55]/95 to-[#296374]/90 backdrop-blur-xl border-2 border-[#629FAD]/50 text-center relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#629FAD]/30 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#296374]/30 blur-3xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-bold text-white">Ready to Start Your Journey?</h2>
              <p className="text-[#EDEDCE]/80 text-lg max-w-2xl mx-auto">
                Join thousands of job seekers who have improved their interview skills and landed their dream jobs.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0C2C55] font-bold rounded-lg hover:bg-[#629FAD] hover:text-white transition-all hover:scale-110 shadow-xl"
                >
                  Get Started Free
                  <FiArrowRight />
                </a>
                <a
                  href="/landing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-[#629FAD] text-[#629FAD] font-bold rounded-lg hover:bg-[#629FAD] hover:text-white transition-all hover:scale-110"
                >
                  Learn More
                </a>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}
