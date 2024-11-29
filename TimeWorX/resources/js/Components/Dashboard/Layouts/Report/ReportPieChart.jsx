import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const ReportPieChart = ({ labels, dataValues, colors }) => {
  const allZero = dataValues.every(value => value === 0);
  
  // Prepare data for the Pie chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Report Status",
        data: dataValues,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map(color => color + "BB"),
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "left",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          font: {
            size: 12,
          },
          paddingTop: 0,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full h-48 flex justify-center items-center">
        {allZero ? (
          <p className="w-full h-full flex items-center justify-center text-xs">No task has been created yet</p>
        ) : (
          <Pie data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default ReportPieChart;
