import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface Props {
  protein: number;
  carbs: number;
  fat: number;
}

const MacroChart = ({ protein, carbs, fat }: Props) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = [protein, carbs, fat];
      chartInstance.current.update();
    } else if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
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
    }
  }, [protein, carbs, fat]);

  return <canvas ref={chartRef} />;
};

export default MacroChart;
