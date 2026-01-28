import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Resume from "./pages/Resume";
import Interview from "./pages/Interview";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/interview" element={<Interview />} />
      </Routes>
    </BrowserRouter>
  );
}
