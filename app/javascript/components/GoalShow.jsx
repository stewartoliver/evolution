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

  const handleEditClick = (task, isDragOperation = false) => {
    if (isDragOperation) {
      // For drag operations, just update the task status
      const updatedTask = {
        id: task.id,
        status: task.status
      };
      handleSaveTask(updatedTask, true);
    } else {
      // For regular edits, open the modal
      setCurrentTask(task);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTask(null);
  };

  const handleSaveTask = async (updatedTask, isDragOperation = false) => {
    try {
      const method = isDragOperation ? 'PATCH' : 'PUT';
      const body = isDragOperation 
        ? JSON.stringify({ task: { status: updatedTask.status } })
        : JSON.stringify({ task: updatedTask });

      const response = await fetch(`/objectives/tasks/${updatedTask.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        },
        body,
      });

      if (response.ok) {
        const updatedTaskData = await response.json();
        setTasks(prevTasks => prevTasks.map(task => 
          task.id === updatedTaskData.id ? updatedTaskData : task
        ));
        if (!isDragOperation) {
          setShowModal(false);
          setCurrentTask(null);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving task:', error);
      // Revert the local state if the server update fails
      if (isDragOperation) {
        setTasks(prevTasks => [...prevTasks]);
      }
    }
  };

  const handleDeleteClick = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleAddTask = (status) => {
    setShowModal(true);
    setCurrentTask({ goal_id: goalId, status });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Board 
        goalId={goalId}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onAddTask={handleAddTask}
      />
      <Modal show={showModal} onClose={handleCloseModal}>
        {currentTask && <EditTaskForm task={currentTask} onSave={handleSaveTask} />}
      </Modal>
    </div>
  );
};

export default GoalShow;
