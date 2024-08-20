import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import EditTaskForm from './EditTaskForm';

function openEditTaskModal(taskId, title, description, status) {
    const task = { id: taskId, title, description, status };

    const modalContainer = document.getElementById('edit-task-form-container');
    if (modalContainer) {
        ReactDOM.render(
            <Modal show={true} onClose={closeEditTaskModal}>
                <EditTaskForm task={task} onSave={handleSave} />
            </Modal>,
            modalContainer
        );
    }
}

function closeEditTaskModal() {
    const modalContainer = document.getElementById('edit-task-form-container');
    if (modalContainer) {
        ReactDOM.unmountComponentAtNode(modalContainer);
    }
}

function handleSave(updatedTask) {
    console.log('Task saved:', updatedTask);
    closeEditTaskModal();
    // Additional logic to update the task in your state or backend
}

window.openEditTaskModal = openEditTaskModal;
window.closeEditTaskModal = closeEditTaskModal;
