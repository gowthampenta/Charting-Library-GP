import React, { useEffect, useState, useRef, useCallback } from "react";
import Chart from "./components/Chart";
import TimeframeSelector from "./components/TimeframeSelector";
import { toPng, toJpeg } from "html-to-image";
import { saveAs } from "file-saver";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeframe, setTimeframe] = useState("daily");
  const chartRef = useRef(null);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const filterData = useCallback(
    (timeframe) => {
      let filtered;
      const now = new Date();
      switch (timeframe) {
        case "daily":
          filtered = data.filter(
            (d) =>
              new Date(d.timestamp) >=
              new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
          );
          break;
        case "weekly":
          filtered = data.filter(
            (d) =>
              new Date(d.timestamp) >=
              new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
          );
          break;
        case "monthly":
          filtered = data.filter(
            (d) =>
              new Date(d.timestamp) >=
              new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          );
          break;
        default:
          filtered = data;
      }
      setFilteredData(filtered);
    },
    [data]
  );

  useEffect(() => {
    filterData(timeframe);
  }, [data, timeframe, filterData]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handlePointClick = (data) => {
    alert(`Timestamp: ${data.timestamp}\nValue: ${data.value}`);
  };

  const exportChart = (format) => {
    if (chartRef.current) {
      if (format === "png") {
        toPng(chartRef.current).then((blob) => {
          saveAs(blob, `chart.${format}`);
        });
      } else if (format === "jpg") {
        toJpeg(chartRef.current).then((blob) => {
          saveAs(blob, `chart.${format}`);
        });
      }
    }
  };

  return (
    <div className="App">
      <h1>Charting Application</h1>
      <TimeframeSelector onSelect={handleTimeframeChange} />
      <div className="controls">
        <button onClick={() => exportChart("png")}>Export as PNG</button>
        <button onClick={() => exportChart("jpg")}>Export as JPG</button>
      </div>
      <div className="chart-container" ref={chartRef}>
        <Chart data={filteredData} onPointClick={handlePointClick} />
      </div>
    </div>
  );
};

export default App;
