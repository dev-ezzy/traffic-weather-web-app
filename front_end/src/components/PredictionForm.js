import React, { useState } from 'react';
import { getPrediction } from '../services/api';
import './PredictionForm.css';

function PredictionForm() {
  const [inputs, setInputs] = useState({ date: '', time: '', variable: '' });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        date: inputs.date,
        time: inputs.time,
        targets: inputs.variable ? [inputs.variable] : undefined,
      };
      const response = await getPrediction(payload);
      setResult(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  const interpretValue = (key, value) => {
    const num = parseFloat(value);
    if (key.toLowerCase().includes('speed')) {
      if (num < 10) return 'Slow';
      if (num >= 10 && num <= 18) return 'Moderate';
      return 'Fast';
    } else if (key.toLowerCase().includes('time')) {
      if (num < 10) return 'Fast';
      if (num >= 10 && num <= 18) return 'Average';
      return 'Slow / Congested';
    }
    return num.toFixed(2);
  };

  return (
    <>
      <video autoPlay muted loop id="bgVideo">
        <source src="/videos/vecteezy_time-lapse-traffic-on-city-road-at-night_22570880.mov" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="prediction-container">
        <h2 className="title">🔮 Traffic Prediction 🔮</h2>

        <form className="prediction-form" onSubmit={handleSubmit}>
          <label>Date:</label>
          <input type="date" name="date" onChange={handleChange} required />

          <label>Time:</label>
          <input type="time" name="time" onChange={handleChange} required />

          <label>Target Variable:</label>
          <select name="variable" onChange={handleChange}>
            <option value="">All Variables</option>
            <option value="currentSpeed">Predicted Speed</option>
            <option value="currentTravelTime">Predicted Travel Time</option>
            <option value="freeFlowSpeed">Free Flow Speed</option>
            <option value="freeFlowTravelTime">Free Flow Travel Time</option>
          </select>

          <button type="submit">Predict</button>
        </form>

        {result && (
          <div className="result-box">
            <h3>Prediction Result</h3>
            {Object.entries(result.predictions)
              .filter(([key]) => !inputs.variable || key === inputs.variable)
              .map(([key, val]) => (
                <div className="result-item" key={key}>
                  <strong>{key}</strong>: {parseFloat(val).toFixed(2)} ({interpretValue(key, val)})
                </div>
              ))}
            <p><strong>Timestamp:</strong> {result.timestamp}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default PredictionForm;