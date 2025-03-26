// app/javascript/components/GoalShow.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import EditTaskForm from './EditTaskForm';
import Board from './Board';

const GoalShow = ({ goalId }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/objectives/tasks/filter_by_goal?goal_id=${goalId}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [goalId]);

  const handleEditClick = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTask(null);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const response = await fetch(`/objectives/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskData = await response.json();
        setTasks(tasks.map(task => 
          task.id === updatedTaskData.id ? updatedTaskData : task
        ));
        setShowModal(false);
        setCurrentTask(null);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Board tasks={tasks} onEditClick={handleEditClick} />
      <Modal show={showModal} onClose={handleCloseModal}>
        {currentTask && <EditTaskForm task={currentTask} onSave={handleSaveTask} />}
      </Modal>
    </div>
  );
};

export default GoalShow;
