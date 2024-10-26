import React from "react";
import TaskCompletionPieChart from "./TaskCompletionPieChart";

function CardProjectAnalysis() {
  const labels = [ "To-Do", "In-Progress", "Verify","Done"];
  const dataValues = [25, 10, 30, 35];
  const colors = ["#117add", "#f1c21b", "#da1e28", "#25a249"];

  return (
    <div>
      <TaskCompletionPieChart 
        labels={labels} 
        dataValues={dataValues} 
        colors={colors} 
        title="Mức độ hoàn thành dự án"
      />
    </div>
  );
}

export default CardProjectAnalysis;
