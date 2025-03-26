// app/javascript/components/TasksChart.js

import React, { useState, useEffect } from 'react';
import { LineChart } from 'react-chartkick';
import { Chart } from 'chart.js/auto'; // Updated import
import axios from 'axios';

const TasksChart = () => {
  const [tasksData, setTasksData] = useState({});

  useEffect(() => {
    fetchTasksData();
  }, []);

  const fetchTasksData = async () => {
    try {
      const response = await axios.get('/api/v1/tasks_completed_per_day');
      console.log('API Response:', response.data); // Debug: log the API response
      const formattedData = response.data.reduce((acc, item) => {
        const dateKey = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[dateKey] = item.count;
        return acc;
      }, {});
      console.log('Formatted Data:', formattedData); // Debug: log the formatted data
      setTasksData(formattedData);
    } catch (error) {
      console.error('Error fetching tasks data:', error);
    }
  };

  return (
    <div>
      <h2>Tasks Completed Per Day</h2>
      <LineChart data={tasksData} />
    </div>
  );
};

export default TasksChart;
