import React from "react";
import TaskCompletionPieChart from "./TaskCompletionPieChart";

function CardProjectAnalysis({ projectName,labels, dataValues, colors }) {

  return (
      <TaskCompletionPieChart 
        labels={labels} 
        dataValues={dataValues} 
        colors={colors} 
        title={projectName}
      />
  );
}

export default CardProjectAnalysis;
