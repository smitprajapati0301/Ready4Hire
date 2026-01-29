import { useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import SectionHeading from "../components/ui/SectionHeading";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const steps = [
  {
    title: "Upload your resume",
    description:
      "Submit a PDF and receive an ATS breakdown, missing sections, and key insights. The robots will finally understand you.",
    emoji: "📄",
  },
  {
    title: "Review your score",
    description:
      "Understand your readiness with prioritized suggestions and skill extraction. We'll be honest, but gentle.",
    emoji: "📊",
  },
  {
    title: "Practice interviews",
    description:
      "Get AI-generated questions, voice mode, and personalized feedback. It's like a dress rehearsal, minus the stage fright.",
    emoji: "🎤",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useScrollAnimation(0, "fade-up");
  const stepsRef = useScrollAnimation(100, "slide-left");
  const ctaRef = useScrollAnimation(100, "blur-in");

  return (
    <div className="bg-linear-to-br from-[#0C2C55] via-[#296374] to-[#0C2C55]">
      <section ref={heroRef} className="relative overflow-hidden opacity-0">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#629FAD]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#296374]/20 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <Container className="relative py-20 sm:py-28">
          <div className="grid gap-16 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="space-y-8 animate-fade-up">
              <Badge variant="soft" className="bg-[#629FAD]/20 text-[#629FAD] border-[#629FAD]/30">
                💡 How It Works
              </Badge>
              <h1 className="text-5xl font-bold text-white sm:text-6xl lg:text-7xl leading-tight">
                AI-powered preparation<br />
                <span className="text-[#629FAD]">that feels human.</span>
              </h1>
              <p className="text-lg text-[#EDEDCE]/80 sm:text-xl leading-relaxed">
                Ready4Hire helps you refine your resume and practice for
                interviews with fast feedback loops and a clean, focused
                workflow. <span className="text-[#629FAD] font-semibold">Think of us as your career GPS—minus the annoying "recalculating" voice.</span>
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/resume")}
                  className="bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#7bb6c3] hover:to-[#3a7a8a] text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-[#629FAD]/50"
                >
                  🚀 Start now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/interview")}
                  className="border-[#629FAD] bg-transparent text-[#629FAD] hover:bg-[#629FAD]/10 transform hover:scale-105 transition-all duration-200"
                >
                  🎤 Jump to interview
                </Button>
              </div>
            </div>
            <div className="grid gap-6 animate-scale-in">
              <Card className="p-8 bg-white/10 backdrop-blur-lg border-[#629FAD]/30 hover:border-[#629FAD]/50 transition-all duration-300 transform hover:scale-105">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#629FAD]">
                  📈 AI INSIGHTS
                </p>
                <p className="mt-4 text-5xl font-bold text-white">+32%</p>
                <p className="mt-3 text-base text-[#EDEDCE]/80">
                  Average ATS improvement after applying suggestions. <span className="text-[#629FAD]">(The robots approve!)</span>
                </p>
              </Card>
              <Card className="p-8 bg-white/10 backdrop-blur-lg border-[#629FAD]/30 hover:border-[#629FAD]/50 transition-all duration-300 transform hover:scale-105">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#629FAD]">
                  ⚡ INTERVIEW READY
                </p>
                <p className="mt-4 text-5xl font-bold text-white">10 min</p>
                <p className="mt-3 text-base text-[#EDEDCE]/80">
                  Typical time to start your first mock interview. <span className="text-[#629FAD]">(Faster than your coffee break!)</span>
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#0C2C55]">
        <Container className="py-20 sm:py-28">
          <SectionHeading
            eyebrow="Process"
            title="Your path to interview confidence"
            description="Follow a clear, repeatable workflow built for focus and momentum. No overthinking required."
            className="text-white"
          />
          <div ref={stepsRef} className="mt-12 grid gap-8 opacity-0 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card 
                key={step.title} 
                className="p-8 bg-white/10 backdrop-blur-lg border-[#629FAD]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#629FAD]/20 hover:border-[#629FAD]/50 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-[#629FAD] to-[#296374] text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    0{index + 1}
                  </div>
                  <span className="text-4xl group-hover:scale-125 transition-transform duration-300">{step.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#629FAD] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="mt-3 text-base text-[#EDEDCE]/80 leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-linear-to-br from-[#296374] to-[#0C2C55]">
        <Container className="py-20 sm:py-28">
          <div ref={ctaRef} className="rounded-3xl border-2 border-[#629FAD]/40 bg-linear-to-r from-[#629FAD]/20 to-[#296374]/20 backdrop-blur-xl p-10 text-white opacity-0 sm:p-16 relative overflow-hidden group hover:border-[#629FAD]/60 transition-all duration-500">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#629FAD]/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#296374]/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#629FAD] font-bold">
                  🎯 READY TO BEGIN?
                </p>
                <h3 className="mt-4 text-3xl font-bold sm:text-4xl">
                  Upload your resume and unlock<br />tailored coaching.
                </h3>
                <p className="mt-4 text-lg text-[#EDEDCE]/80">
                  Your dream job won't wait forever. <span className="text-[#629FAD] font-semibold">(But we will, patiently.)</span>
                </p>
              </div>
              <Button
                size="lg"
                className="bg-white text-[#0C2C55] hover:bg-[#EDEDCE] transform hover:scale-110 transition-all duration-200 shadow-xl px-8 py-4 font-bold"
                onClick={() => navigate("/resume")}
              >
                🎯 Get started free
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
