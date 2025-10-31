import React from "react";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import ZAPTRStyleCalculator from "./components/ZAPTRStyleCalculator";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<ZAPTRStyleCalculator />} />
        </Routes>
        <Toaster />
      </HashRouter>
    </div>
  );
}

export default App;