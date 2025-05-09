// src/components/TrafficPanel.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function TrafficPanel({ date }) {
  const [traffic, setTraffic] = useState(null);
  const [history, setHistory] = useState(null);

  const fetchTraffic = useCallback(async () => {
    try {
      const response = await axios.get(`/api/traffic?date=${date}`);
      setTraffic(response.data.current);
      setHistory(response.data.history);
    } catch (error) {
      console.error('Traffic data fetch error:', error);
    }
  }, [date]);

  useEffect(() => {
    fetchTraffic();
  }, [fetchTraffic]);

  const renderChart = (label, values) => {
    const labels = values.map(v => v.timestamp);
    const data = {
      labels,
      datasets: [{
        label,
        data: values.map(v => v.value),
        borderColor: 'green',
        fill: false
      }]
    };
    return <Line data={data} />;
  };

  return (
    <div>
      <h3>🚗 Traffic</h3>
      {traffic ? (
        <ul>
          {Object.entries(traffic).map(([key, val]) => (
            <li key={key}><strong>{key}:</strong> {val}</li>
          ))}
        </ul>
      ) : <p>Loading traffic data...</p>}

      {history ? (
        <>
          <h4>Traffic Trends</h4>
          {Object.entries(history).map(([key, values]) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <h5>{key}</h5>
              {renderChart(key, values)}
            </div>
          ))}
        </>
      ) : <p>Loading traffic trends...</p>}
    </div>
  );
}

export default TrafficPanel;
