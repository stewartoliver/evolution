import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import RoutineForm from './components/RoutineForm';
import LogForm from './components/LogForm';
import "chartkick/chart.js";
import "@hotwired/turbo-rails";
import Board from './components/Board'; // Ensure the correct path is used here

document.addEventListener('DOMContentLoaded', () => {
  const appRootElement = document.getElementById('root');
  if (appRootElement) {
    const root = createRoot(appRootElement);
    root.render(
      <Router>
        <App />
      </Router>
    );
  }

  const routineFormElement = document.getElementById('routine-form-container');
  if (routineFormElement) {
    const routineFormRoot = createRoot(routineFormElement);
    routineFormRoot.render(
      <Router>
        <RoutineForm />
      </Router>
    );
  }

  const logFormElement = document.getElementById('log-form-container');
  if (logFormElement) {
    const logFormRoot = createRoot(logFormElement);
    logFormRoot.render(
      <Router>
        <LogForm />
      </Router>
    );
  }

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
});
