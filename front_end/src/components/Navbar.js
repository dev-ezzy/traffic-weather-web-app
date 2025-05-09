// src/components/Navbar.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ background: '#333', padding: '10px' }}>
      <Link to="/" style={{ color: 'blue', marginRight: '20px' }}>Dashboard</Link>
      <Link to="/predict" style={{ color: 'red' }}>Make a Prediction</Link>
    </nav>
  );
}

export default Navbar;
