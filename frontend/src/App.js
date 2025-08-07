import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./components/HomePage";
import PuzzleSelection from "./components/PuzzleSelection";
import ChessGame from "./components/ChessGame";
import ProgressDashboard from "./components/ProgressDashboard";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/puzzles" element={<PuzzleSelection />} />
          <Route path="/play/:puzzleId" element={<ChessGame />} />
          <Route path="/progress" element={<ProgressDashboard />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;