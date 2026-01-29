import { useNavigate } from "react-router-dom";
import { FiFileText, FiMessageSquare, FiZap, FiStar } from "react-icons/fi";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import IconBadge from "../components/ui/IconBadge";
import Stat from "../components/ui/Stat";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useScrollAnimation(0, "fade-up");
  const featuresRef = useScrollAnimation(100, "slide-left");
  const featureItemsRef = useScrollAnimation(200, "scale-in");
  const ctaRef = useScrollAnimation(100, "blur-in");

  return (
    <div className="bg-[#0C2C55] text-[#EDEDCE]">
      <section ref={heroRef} className="relative overflow-hidden opacity-0">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-[#629FAD]/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-[#296374]/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <Container className="relative py-16 sm:py-24">
          <div className="max-w-3xl space-y-8 animate-fade-up">
            <Badge variant="solid" className="bg-[#629FAD] text-[#0C2C55] hover:bg-[#7bb6c3]">
              🚀 Your AI Career Wingman
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Ready<span className="text-[#629FAD] animate-pulse">4</span>Hire
              <br />
              <span className="text-[#EDEDCE]">Because "winging it" isn't a strategy</span>
            </h1>
            <p className="text-lg text-[#EDEDCE]/80 sm:text-xl leading-relaxed">
              Tired of wondering if your resume will get past the robots? We'll help you charm the ATS,
              ace the interview, and land that dream job. <span className="text-[#629FAD] font-semibold">No sweat. Well, maybe a little.</span>
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("/resume")}
                className="w-full sm:w-auto bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#7bb6c3] hover:to-[#3a7a8a] text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-[#629FAD]/50"
              >
                ✨ Analyze my resume
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-[#629FAD] bg-transparent text-[#629FAD] hover:bg-[#629FAD]/10 sm:w-auto transform hover:scale-105 transition-all duration-200"
                onClick={() => navigate("/landing")}
              >
                🎬 See the magic
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat value="92%" label="ATS friendliness boost" className="text-[#629FAD]" />
              <Stat value="2x" label="Interview confidence" className="text-[#629FAD]" />
              <Stat value="∞" label="Practice attempts (we won't judge)" className="text-[#629FAD]" />
            </div>
          </div>
        </Container>
      </section>

      <section ref={featuresRef} className="bg-linear-to-br from-[#296374] to-[#0C2C55] text-[#EDEDCE] opacity-0">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,1fr]">
            <div ref={featureItemsRef} className="space-y-6 opacity-0">
              <Badge variant="soft" className="bg-[#629FAD]/20 text-[#629FAD] border-[#629FAD]/30">
                🎯 Why Ready4Hire?
              </Badge>
              <h2 className="text-4xl font-bold sm:text-5xl text-white">
                We're like a personal trainer.<br />
                <span className="text-[#629FAD]">But for your career.</span>
              </h2>
              <p className="text-[#EDEDCE]/80 text-lg leading-relaxed">
                No fluff, no filler. Just clean insights, actionable suggestions, and realistic interview
                simulations that actually prepare you for the real thing. <span className="text-[#629FAD] font-semibold">Plus, we're available 24/7 without the gym fees.</span>
              </p>
              <div className="mt-8 space-y-4 text-base">
                <p className="flex items-start gap-3 group hover:translate-x-2 transition-transform duration-200">
                  <span className="text-2xl">✅</span>
                  <span className="text-[#EDEDCE]/90">Upload a PDF resume in seconds and get a clear ATS breakdown <span className="text-[#629FAD] opacity-0 group-hover:opacity-100 transition-opacity">(spoiler: the robots will love you)</span></span>
                </p>
                <p className="flex items-start gap-3 group hover:translate-x-2 transition-transform duration-200">
                  <span className="text-2xl">✅</span>
                  <span className="text-[#EDEDCE]/90">Practice interviews with voice mode and live feedback <span className="text-[#629FAD] opacity-0 group-hover:opacity-100 transition-opacity">(no awkward silences, we promise)</span></span>
                </p>
                <p className="flex items-start gap-3 group hover:translate-x-2 transition-transform duration-200">
                  <span className="text-2xl">✅</span>
                  <span className="text-[#EDEDCE]/90">Mobile-ready and always accessible <span className="text-[#629FAD] opacity-0 group-hover:opacity-100 transition-opacity">(practice on the bus, we won't tell)</span></span>
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <IconBadge
                icon={<FiFileText />}
                title="Resume Intelligence"
                description="Detect gaps, missing sections, and ATS improvements instantly. Your resume will thank you."
                className="hover:-translate-y-2 transition-transform duration-300"
              />
              <IconBadge
                icon={<FiMessageSquare />}
                title="Mock Interview Coach"
                description="Ask, answer, and improve with AI-generated feedback. It's like having a mentor who never gets tired."
                className="hover:-translate-y-2 transition-transform duration-300"
              />
              <IconBadge
                icon={<FiZap />}
                title="Actionable Insights"
                description="Get concise guidance that translates into results. Less theory, more action."
                className="hover:-translate-y-2 transition-transform duration-300"
              />
              <IconBadge
                icon={<FiStar />}
                title="Modern UX"
                description="Fast, mobile-first experience. Because waiting for page loads is so 2010."
                className="hover:-translate-y-2 transition-transform duration-300"
              />
            </div>
          </div>
        </Container>
      </section>

      <section ref={ctaRef} className="bg-[#0C2C55] text-[#EDEDCE] opacity-0">
        <Container className="py-16 sm:py-24">
          <div className="rounded-3xl border-2 border-[#629FAD]/30 bg-linear-to-br from-[#296374]/50 to-[#0C2C55]/50 backdrop-blur-xl p-10 sm:p-14 relative overflow-hidden hover:border-[#629FAD]/50 transition-all duration-300 group">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#629FAD]/10 blur-3xl group-hover:bg-[#629FAD]/20 transition-all duration-500" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#296374]/10 blur-3xl group-hover:bg-[#296374]/20 transition-all duration-500" />
            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <Badge variant="neutral" className="bg-[#629FAD]/20 text-[#629FAD] border-[#629FAD]/30">
                  🚀 Ready to level up?
                </Badge>
                <h3 className="text-3xl font-bold text-white sm:text-4xl">
                  Turn your resume into<br />interview-ready confidence.
                </h3>
                <p className="text-[#EDEDCE]/80 text-lg max-w-xl">
                  Upload your resume and begin the AI-guided interview flow in minutes.
                  Your future employer is waiting. <span className="text-[#629FAD] font-semibold">(Don't keep them waiting too long!)</span>
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate("/resume")}
                className="bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#7bb6c3] hover:to-[#3a7a8a] text-white transform hover:scale-110 transition-all duration-200 shadow-xl hover:shadow-[#629FAD]/50 px-8 py-4"
              >
                🎯 Upload resume now
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
