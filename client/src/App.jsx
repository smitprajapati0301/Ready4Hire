import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Resume from "./pages/Resume";
import Interview from "./pages/Interview";
import Home from "./pages/Home";
import SiteShell from "./components/layout/SiteShell";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/interview" element={<Interview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
