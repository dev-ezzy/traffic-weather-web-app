
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import PredictionForm from './components/PredictionForm.js';
import Navbar from './components/Navbar.js';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<PredictionForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
