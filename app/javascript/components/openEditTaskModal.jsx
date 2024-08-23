import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import EditTaskForm from './EditTaskForm';

let modalRoot = null;
let modalContainer = null;

function openEditTaskModal(task) {
    if (!modalContainer) {
        modalContainer = document.getElementById('edit-task-form-container');
    }

    if (!modalRoot) {
        modalRoot = ReactDOM.createRoot(modalContainer); // Create the root only once
    }

    modalRoot.render(
        <Modal show={true} onClose={closeEditTaskModal}>
            <EditTaskForm task={task} onSave={handleSave} />
        </Modal>
    );
}

function closeEditTaskModal() {
    if (modalRoot) {
        modalRoot.unmount(); // Unmount the modal component
        modalRoot = null; // Reset the root so it can be re-created if needed
    }
}

function handleSave(updatedTask) {
    console.log('Task saved:', updatedTask);

    saveTask(updatedTask)
        .then(() => {
            closeEditTaskModal();
            window.location.reload(); // Reload the page after saving the task
        })
        .catch((error) => {
            console.error('Failed to save task:', error);
            // Handle errors if needed
        });
}

// Example saveTask function
function saveTask(task) {
    return fetch(`/objectives/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}

window.openEditTaskModal = openEditTaskModal;
window.closeEditTaskModal = closeEditTaskModal;
