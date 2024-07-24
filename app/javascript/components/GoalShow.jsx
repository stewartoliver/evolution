// app/javascript/components/GoalShow.jsx
import React, { useState } from 'react';
import Modal from './Modal';
import EditTaskForm from './EditTaskForm';
import Board from './Board';

const GoalShow = ({ tasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleEditClick = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTask(null);
  };

  const handleSaveTask = (updatedTask) => {
    // Handle task update logic here
    console.log('Updated Task:', updatedTask);
    setShowModal(false);
    setCurrentTask(null);
  };

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
