import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import EditTaskForm from './EditTaskForm';

let modalRoot = null;
let modalContainer = null;

async function openEditTaskModal(task) {
    if (!modalContainer) {
        modalContainer = document.getElementById('edit-task-form-container');
    }

    if (!modalRoot) {
        modalRoot = ReactDOM.createRoot(modalContainer);
    }

    try {
        // Fetch the task with its checklists
        const response = await fetch(`/objectives/tasks/${task.id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch task');
        }
        const taskWithChecklists = await response.json();

        modalRoot.render(
            <Modal show={true} onClose={closeEditTaskModal}>
                <EditTaskForm task={taskWithChecklists} onSave={handleSave} />
            </Modal>
        );
    } catch (error) {
        console.error('Error fetching task:', error);
    }
}

function closeEditTaskModal() {
    if (modalRoot) {
        modalRoot.unmount();
        modalRoot = null;
    }
}

async function handleSave(updatedTask) {
    try {
        const response = await fetch(`/objectives/tasks/${updatedTask.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ task: updatedTask }),
        });

        if (!response.ok) {
            throw new Error('Failed to save task');
        }

        // Update the task in the UI without reloading
        const updatedTaskData = await response.json();
        
        // Dispatch a custom event to notify other components about the update
        const event = new CustomEvent('taskUpdated', { detail: updatedTaskData });
        document.dispatchEvent(event);
    } catch (error) {
        console.error('Error saving task:', error);
        // You might want to show an error notification to the user here
    }
}

window.openEditTaskModal = openEditTaskModal;
window.closeEditTaskModal = closeEditTaskModal;
