// src/components/Dashboard.js
import React, { useState } from 'react';
import WeatherPanel from './weather_panel';  // Ensure this is correctly named/capitalized
import TrafficPanel from './traffic_panel';  // Ensure this is correctly named/capitalized
// import './Dashboard.css'; // Optional: if you're adding styles

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDateSubmit = () => {
    // No additional action needed here because date prop is reactive
  };

  return (
    <div className="dashboard-container">
      <h2>🚦 Real-Time Traffic & Weather Dashboard</h2>

      <div className="date-selector" style={{ marginBottom: '1rem' }}>
        <label>Select a date (last 30 days): </label>
        <input
          type="date"
          max={new Date().toISOString().split('T')[0]}
          value={selectedDate}
          onChange={handleDateChange}
        />
        <button onClick={handleDateSubmit} style={{ marginLeft: '0.5rem' }}>
          Submit
        </button>
      </div>

      <div className="panels" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <WeatherPanel date={selectedDate} />
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <TrafficPanel date={selectedDate} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
