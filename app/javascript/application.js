import "@hotwired/turbo-rails"; // Handles navigation and form submissions
import Rails from "@rails/ujs";  // Handles non-GET requests in links/forms
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import RoutineForm from './components/RoutineForm';
import LogForm from './components/LogForm';
import Board from './components/Board';
import TasksChart from './components/TasksChart';
import HeartIcon from './components/HeartIcon';
import CompleteGoalButton from './components/CompleteGoalButton';
import EditTaskForm from './components/EditTaskForm';
import Modal from './components/Modal';
import GoalProgress from './components/GoalProgress';
import "./components/tasks";  // Or "./controllers/tasks" depending on where you place it


import "chartkick/chart.js"; // Import chart.js for Chartkick

// Initialize Rails UJS
Rails.start();

// Function to initialize React components
const initializeReactComponents = () => {
  // Main app component
  const appRootElement = document.getElementById('root');
  if (appRootElement) {
    const root = createRoot(appRootElement);
    root.render(
      <Router>
        <App />
      </Router>
    );
  }

  // Routine form component
  const routineFormElement = document.getElementById('routine-form-container');
  if (routineFormElement) {
    const routineFormRoot = createRoot(routineFormElement);
    routineFormRoot.render(
      <Router>
        <RoutineForm />
      </Router>
    );
  }

  // Log form component
  const logFormElement = document.getElementById('log-form-container');
  if (logFormElement) {
    const logFormRoot = createRoot(logFormElement);
    logFormRoot.render(
      <Router>
        <LogForm />
      </Router>
    );
  }

  // Board component
  const boardRootElement = document.getElementById('board-root');
  if (boardRootElement) {
    const goalId = boardRootElement.getAttribute('data-goal-id');
    const root = createRoot(boardRootElement);
    root.render(
      <Router>
        <Board goalId={goalId} />
      </Router>
    );
  }

  // Tasks chart component
  const tasksChartElement = document.getElementById('tasks-chart-container');
  if (tasksChartElement) {
    const chartRoot = createRoot(tasksChartElement);
    chartRoot.render(<TasksChart />);
  }

  // Heart icon component
  document.querySelectorAll('.heart-icon').forEach(div => {
    const goalId = parseInt(div.getAttribute('data-goal-id'), 10);
    const initialFavourite = div.getAttribute('data-initial-favourite') === 'true';
    const root = createRoot(div);
    root.render(<HeartIcon goalId={goalId} initialFavourite={initialFavourite} />);
  });

  // Complete goal button component
  const completeGoalButtonElement = document.getElementById('complete-goal-button');
  if (completeGoalButtonElement) {
    const goalId = parseInt(completeGoalButtonElement.getAttribute('data-goal-id'), 10);
    const root = createRoot(completeGoalButtonElement);
    root.render(<CompleteGoalButton goalId={goalId} />);
  }

  // Goal progress component
  document.querySelectorAll('.goal-progress').forEach((div) => {
    const progress = parseInt(div.getAttribute('data-progress'), 10);
    const root = createRoot(div);
    root.render(<GoalProgress progress={progress} />);
  });
};

// Function to toggle tasks visibility
function toggleTasks(goalId) {
  const tasksElement = document.getElementById(`tasks-${goalId}`);
  tasksElement.classList.toggle('hidden');
}

// Function to open the edit task modal
function openEditTaskModal(taskId, title, description, status) {
  const task = { id: taskId, title, description, status };

  const modalContainer = document.getElementById('edit-task-form-container');
  if (modalContainer) {
    const root = createRoot(modalContainer);  // Updated to use createRoot
    root.render(
      <Modal show={true} onClose={closeEditTaskModal}>
        <EditTaskForm task={task} onSave={handleSave} />
      </Modal>
    );
  }
}

// Function to close the edit task modal
function closeEditTaskModal() {
  const modalContainer = document.getElementById('edit-task-form-container');
  if (modalContainer) {
    const root = createRoot(modalContainer);  // Updated to use createRoot
    root.unmount();
  }
}

// Function to handle task save and close modal
function handleSave(updatedTask) {
  console.log('Task saved:', updatedTask);
  closeEditTaskModal();
  // Additional logic to update the task in your state or backend
}

// Make these functions globally accessible if needed
window.toggleTasks = toggleTasks;
window.openEditTaskModal = openEditTaskModal;
window.closeEditTaskModal = closeEditTaskModal;

// Function to initialize navigation dropdowns
const initializeNavDropdowns = () => {
  const dropdowns = [
    { button: 'finances-menu-button', dropdown: 'finances-menu-dropdown' },
    { button: 'fitness-menu-button', dropdown: 'fitness-menu-dropdown' },
    { button: 'goals-menu-button', dropdown: 'goals-menu-dropdown' },
  ];

  dropdowns.forEach(({ button, dropdown }) => {
    const menuButton = document.getElementById(button);
    const menuDropdown = document.getElementById(dropdown);

    if (menuButton && menuDropdown) {
      menuButton.addEventListener('click', () => {
        menuDropdown.classList.toggle('hidden');
        menuButton.setAttribute('aria-expanded', !menuDropdown.classList.contains('hidden'));
        closeOtherDropdowns(dropdowns, menuDropdown);
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (event) => {
    dropdowns.forEach(({ button, dropdown }) => {
      const menuButton = document.getElementById(button);
      const menuDropdown = document.getElementById(dropdown);

      if (menuDropdown && menuButton && !event.target.closest(`#${button}`) && !event.target.closest(`#${dropdown}`)) {
        menuDropdown.classList.add('hidden');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  });

  function closeOtherDropdowns(dropdowns, currentDropdown) {
    dropdowns.forEach(({ dropdown }) => {
      const menuDropdown = document.getElementById(dropdown);
      if (menuDropdown && menuDropdown !== currentDropdown) {
        menuDropdown.classList.add('hidden');
        menuDropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
      }
    });
  }
};

// Initialize components and navigation on turbo:load
document.addEventListener('turbo:load', () => {
  initializeReactComponents();
  initializeNavDropdowns();
});
