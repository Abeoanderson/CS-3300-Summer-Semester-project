import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface Props {
  protein: number;
  carbs: number;
  fat: number;
}

const MacroChart = ({ protein, carbs, fat }: Props) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return; //Handle case where context is unavailable

    let chartInstance = new Chart(ctx, { // Declare chartInstance locally
      type: "doughnut",
      data: {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
          {
            label: "Macros",
            data: [protein, carbs, fat],
            backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Macronutrient Breakdown",
          },
        },
      },
    });

    return () => { // Cleanup function
      chartInstance.destroy();
    };
  }, [protein, carbs, fat]);

  return <canvas ref={chartRef} />;
};

export default MacroChart;