// src/components/WeatherPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function WeatherPanel({ date }) {
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`/api/weather?date=${date}`);
        setWeather(response.data.current);
        setHistory(response.data.history);
      } catch (error) {
        console.error('Weather data fetch error:', error);
      }
    };

    fetchWeather();
  }, [date]);  // Only re-run when date changes

  const renderChart = (label, values) => {
    const labels = values.map(v => v.timestamp);
    const data = {
      labels,
      datasets: [{
        label,
        data: values.map(v => v.value),
        borderColor: 'blue',
        fill: false
      }]
    };
    return <Line data={data} />;
  };

  return (
    <div>
      <h3>🌤 Weather</h3>

      {weather ? (
        <ul>
          {Object.entries(weather).map(([key, val]) => (
            <li key={key}><strong>{key}:</strong> {val}</li>
          ))}
        </ul>
      ) : (
        <p>Loading weather data...</p>
      )}

      {history ? (
        <>
          <h4>Weather Trends</h4>
          {Object.entries(history).map(([key, values]) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <h5>{key}</h5>
              {renderChart(key, values)}
            </div>
          ))}
        </>
      ) : (
        <p>Loading weather trends...</p>
      )}
    </div>
  );
}

export default WeatherPanel;
