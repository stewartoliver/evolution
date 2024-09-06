import "@hotwired/turbo-rails";
import Rails from "@rails/ujs";
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
import "./components/Task";
import HabitLogForm from './components/HabitLogForm';

import 'chart.js/auto';
import 'chartkick/chart.js';

Rails.start();

const renderComponent = (elementId, Component, props = {}) => {
  const element = document.getElementById(elementId);
  if (element) {
    const root = createRoot(element);
    root.render(
      <Router>
        <Component {...props} />
      </Router>  /
    );
  }
};

const initializeReactComponents = () => {
  renderComponent('root', App);
  renderComponent('routine-form-container', RoutineForm);

  const logFormElement = document.getElementById('log-form-container');
  if (logFormElement) {
    const logData = logFormElement.getAttribute('data-log-data');
    const initialExercises = logData ? JSON.parse(logData).fitness_log_exercises : [];
    const isEditPage = logFormElement.getAttribute('data-is-edit') === 'true';
    renderComponent('log-form-container', LogForm, { initialExercises, isEditPage });
  }

  const boardRootElement = document.getElementById('board-root');
  if (boardRootElement) {
    const goalId = boardRootElement.getAttribute('data-goal-id');
    renderComponent('board-root', Board, { goalId });
  }

  renderComponent('tasks-chart-container', TasksChart);

  document.querySelectorAll('.heart-icon').forEach((div) => {
    const goalId = parseInt(div.getAttribute('data-goal-id'), 10);
    const initialFavourite = div.getAttribute('data-initial-favourite') === 'true';
    const root = createRoot(div);
    root.render(<HeartIcon goalId={goalId} initialFavourite={initialFavourite} />);
  });

  const completeGoalButtonElement = document.getElementById('complete-goal-button');
  if (completeGoalButtonElement) {
    const goalId = parseInt(completeGoalButtonElement.getAttribute('data-goal-id'), 10);
    const root = createRoot(completeGoalButtonElement);
    root.render(<CompleteGoalButton goalId={goalId} />);
  }

  document.querySelectorAll('.goal-progress').forEach((div) => {
    const progress = parseInt(div.getAttribute('data-progress'), 10);
    const root = createRoot(div);
    root.render(<GoalProgress progress={progress} />);
  });

  document.querySelectorAll('.habit-log-form').forEach((div) => {
    const habitId = div.getAttribute('data-habit-id');
    const habitName = div.getAttribute('data-habit-name');
    if (habitId && habitName) {
      const root = createRoot(div);
      root.render(<HabitLogForm habitId={habitId} habitName={habitName} />);
    } else {
      console.error('Missing habitId or habitName. Cannot render HabitLogForm.');
    }
  });
};

const toggleTasks = (goalId) => {
  const tasksElement = document.getElementById(`tasks-${goalId}`);
  tasksElement?.classList.toggle('hidden');
};

let modalRoot = null;

const openEditTaskModal = (task) => {
  const modalContainer = document.getElementById('edit-task-form-container');
  if (!modalRoot) {
    modalRoot = createRoot(modalContainer);
  }
  modalRoot.render(
    <Modal show={true} onClose={closeEditTaskModal}>
      <EditTaskForm task={task} onSave={handleSave} />
    </Modal> /
  );
};

const closeEditTaskModal = () => {
  modalRoot?.unmount();
  modalRoot = null;
};

const handleSave = (updatedTask) => {
  saveTask(updatedTask)
    .then(() => {
      closeEditTaskModal();
      window.location.reload();
    })
    .catch((error) => {
      console.error('Failed to save task:', error);
    });
};

const saveTask = (task) => {
  return fetch(`objectives/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  }).then(response => response.json());
};

const initializeNavDropdowns = () => {
  const dropdowns = [
    { button: 'finances-menu-button', dropdown: 'finances-menu-dropdown' },
    { button: 'fitness-menu-button', dropdown: 'fitness-menu-dropdown' },
    { button: 'goals-menu-button', dropdown: 'goals-menu-dropdown' },
  ];

  const closeOtherDropdowns = (currentDropdown) => {
    dropdowns.forEach(({ dropdown }) => {
      const menuDropdown = document.getElementById(dropdown);
      if (menuDropdown && menuDropdown !== currentDropdown) {
        menuDropdown.classList.add('hidden');
        menuDropdown.previousElementSibling?.setAttribute('aria-expanded', 'false');
      }
    });
  };

  dropdowns.forEach(({ button, dropdown }) => {
    const menuButton = document.getElementById(button);
    const menuDropdown = document.getElementById(dropdown);

    if (menuButton && menuDropdown) {
      menuButton.addEventListener('click', () => {
        menuDropdown.classList.toggle('hidden');
        menuButton.setAttribute('aria-expanded', !menuDropdown.classList.contains('hidden'));
        closeOtherDropdowns(menuDropdown);
      });
    }
  });

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
};

document.addEventListener('turbo:load', () => {
  initializeReactComponents();
  initializeNavDropdowns();
});

window.toggleTasks = toggleTasks;
window.openEditTaskModal = openEditTaskModal;
window.closeEditTaskModal = closeEditTaskModal;
