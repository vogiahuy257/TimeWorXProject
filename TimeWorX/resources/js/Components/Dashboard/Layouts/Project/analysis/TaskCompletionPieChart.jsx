import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskCompletionPieChart = ({ labels, dataValues, colors, title }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Task Status",
        data: dataValues,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map(color => color + "BB"), // Tạo màu nhạt hơn khi hover
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
        },
      },
    },
  };

  return (
    <div>
      <h3>{title || "Biểu đồ biểu thị trạng thái task"}</h3>
      <Pie data={data} options={options} />
    </div>
  );
};

export default TaskCompletionPieChart;
