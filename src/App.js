import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import FocusTimer from "./pages/FocusTimer";
import Habits from "./pages/Habits";
import { Toaster } from "react-hot-toast";
const App = () => (
  <ThemeProvider>
    <Toaster position="top-right" />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/focus" element={<FocusTimer />} />
        <Route path="/habits" element={<Habits />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
