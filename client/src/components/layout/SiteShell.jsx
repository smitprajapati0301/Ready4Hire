import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Container from "../ui/Container";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Overview", to: "/landing" },
  { label: "Resume", to: "/resume" },
  { label: "Interview", to: "/interview" },
];

export default function SiteShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0C2C55] text-[#EDEDCE]">
      <header className="sticky top-0 z-30 border-b border-[#629FAD]/20 bg-[#0C2C55]/90 backdrop-blur-xl shadow-lg shadow-[#0C2C55]/50">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#629FAD] to-[#296374] text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
              R4H
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold text-white group-hover:text-[#629FAD] transition-colors duration-300">Ready4Hire</p>
              <p className="text-xs text-[#629FAD]">🤖 AI Career Coach</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-all duration-200 hover:text-[#629FAD] hover:scale-110 ${
                    isActive ? "text-[#629FAD] scale-110" : "text-[#EDEDCE]/70"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#629FAD]/30 text-[#629FAD] transition-all duration-200 hover:border-[#629FAD] hover:bg-[#629FAD]/10 hover:scale-110 md:hidden"
            aria-label="Toggle navigation"
          >
            <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </Container>
        {menuOpen && (
          <div className="border-t border-[#629FAD]/20 bg-[#0C2C55]/95 backdrop-blur-xl md:hidden animate-fade-up">
            <Container className="flex flex-col gap-4 py-6 text-base font-semibold">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `transition-all duration-200 hover:text-[#629FAD] hover:translate-x-2 ${
                      isActive ? "text-[#629FAD]" : "text-[#EDEDCE]/70"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </Container>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-[#629FAD]/20 bg-linear-to-br from-[#0C2C55] to-[#296374]">
        <Container className="py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#629FAD] to-[#296374] text-white font-bold shadow-lg">
                  R4H
                </div>
                <div>
                  <p className="font-bold text-white">Ready4Hire</p>
                  <p className="text-xs text-[#629FAD]">AI Career Coach</p>
                </div>
              </div>
              <p className="text-sm text-[#EDEDCE]/70 leading-relaxed">
                Helping you ace interviews and perfect your resume. One AI conversation at a time. 🚀
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#629FAD] uppercase tracking-wider">Quick Links</h3>
              <div className="flex flex-col gap-2 text-sm">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="text-[#EDEDCE]/70 hover:text-[#629FAD] transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Creators */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#629FAD] uppercase tracking-wider">Created By</h3>
              <div className="space-y-3 text-sm">
                <div className="group">
                  <p className="font-semibold text-white mb-1">Smit Prajapati</p>
                  <div className="flex gap-3">
                    <a 
                      href="https://www.linkedin.com/in/smit-prajapati-a375a7284/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#629FAD] hover:text-white transition-colors duration-200"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href="https://github.com/smitprajapati0301" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#629FAD] hover:text-white transition-colors duration-200"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
                <div className="group">
                  <p className="font-semibold text-white mb-1">Om Patel</p>
                  <div className="flex gap-3">
                    <a 
                      href="https://www.linkedin.com/in/om-patel-8aa186284/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#629FAD] hover:text-white transition-colors duration-200"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href="https://github.com/OMPATEL122006" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#629FAD] hover:text-white transition-colors duration-200"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#629FAD] uppercase tracking-wider">Support</h3>
              <div className="flex flex-col gap-2 text-sm text-[#EDEDCE]/70">
                <button className="text-left hover:text-[#629FAD] transition-colors duration-200 hover:translate-x-1">Privacy Policy</button>
                <button className="text-left hover:text-[#629FAD] transition-colors duration-200 hover:translate-x-1">Terms of Service</button>
                <button className="text-left hover:text-[#629FAD] transition-colors duration-200 hover:translate-x-1">Contact Support</button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#629FAD]/20">
            <div className="flex flex-col gap-4 text-sm text-[#EDEDCE]/60 md:flex-row md:items-center md:justify-between">
              <p>© 2026 Ready4Hire. Built with 💙 and a lot of ☕. All rights reserved.</p>
              <p className="text-[#629FAD]/80">Making job hunting less painful, one click at a time.</p>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
