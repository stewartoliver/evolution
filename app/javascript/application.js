import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import RoutineForm from './components/RoutineForm';
import LogForm from './components/LogForm';
import "chartkick/chart.js"

document.addEventListener('DOMContentLoaded', () => {
  const appRootElement = document.getElementById('root');
  if (appRootElement) {
    const root = createRoot(appRootElement);
    root.render(<App />);
  }

  const routineFormElement = document.getElementById('routine-form-container');
  if (routineFormElement) {
    const routineFormRoot = createRoot(routineFormElement);
    routineFormRoot.render(<RoutineForm />);
  }

  const logFormElement = document.getElementById('log-form-container');
  if (logFormElement) {
    const logFormRoot = createRoot(logFormElement);
    logFormRoot.render(<LogForm />);
  }
});
