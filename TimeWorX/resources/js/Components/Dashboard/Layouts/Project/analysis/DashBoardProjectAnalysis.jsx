import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DashBoardProjectAnalysis({ project_id, onClose }) {
  return (
    <section id="dashboard-analysis" className="p-4">

      <div className="dashboard-item dashboard0">
        <h1 className="text-lg font-semibold">This is dashboard 0</h1>
      </div>

      <div className="dashboard-item dashboard1">
        <h1 className="text-lg font-semibold">This is dashboard 1</h1>
      </div>

      <div className="dashboard-item dashboard2">
        <h1 className="text-lg font-semibold">This is dashboard 2</h1>
      </div>

    </section>
  );
}

export default DashBoardProjectAnalysis;
