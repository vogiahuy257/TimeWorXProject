import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskCompletionPieChart = ({ labels, dataValues, colors, title }) => {
  const allZero = dataValues.every(value => value === 0);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Task Status",
        data: dataValues,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map(color => color + "BB"), 
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          font: {
            size: 12,
          },
          paddingTop: 8,
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
    <div className="p-2 rounded-lg custom-pie-chart flex flex-col items-center text-center w-full">
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="">
          {allZero ? (
            <p className="w-full h-40 mx-auto text-xs">No tasks have been created yet</p>
          ) : (
            <div className=" w-full h-40">
              <Pie className="p-2 pl-4" data={data} options={options} />
            </div>
          )}
          </div>
    </div>
  );
};

export default TaskCompletionPieChart;
