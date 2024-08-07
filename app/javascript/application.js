// app/javascript/application.js

import "@hotwired/turbo-rails"; // Handles navigation and form submissions
import Rails from "@rails/ujs";  // Handles non-GET requests in links/forms
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import RoutineForm from './components/RoutineForm';
import LogForm from './components/LogForm';
import "chartkick/chart.js";
import Board from './components/Board'; // Ensure the correct path is used here

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
};

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
