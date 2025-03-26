import "@hotwired/turbo-rails";
import "./controllers";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App";
import RoutineForm from "./components/RoutineForm/RoutineForm";
import LogForm from "./components/LogForm/LogForm";
import Board from "./components/Board";
import TasksChart from "./components/TasksChart";
import HeartIcon from "./components/HeartIcon";
import CompleteGoalButton from "./components/CompleteGoalButton";
import EditTaskForm from "./components/EditTaskForm";
import Modal from "./components/Modal";
import GoalProgress from "./components/GoalProgress";
import "./components/Task";
import HabitLogForm from "./components/HabitLogForm";
import ExerciseDirectory from "./components/CommonFitness/ExerciseDirectory";
import GoalShow from "./components/GoalShow";
import TransactionsTable from "./components/CommonFinancial/TransactionsTable";
import { Chart } from 'chart.js/auto';
import Chartkick from 'chartkick';

// Keep track of mounted components
const mountedComponents = new Map();

// Function to render a React component
function renderComponent(Component, elementId, props = {}) {
  console.log(`Attempting to render component: ${Component.name} with ID: ${elementId}`);
  const element = document.getElementById(elementId);
  console.log('Element found:', element);
  
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  try {
    // Unmount existing component if it exists
    if (mountedComponents.has(elementId)) {
      mountedComponents.get(elementId).unmount();
      mountedComponents.delete(elementId);
    }

    // Create new root and render
    const root = createRoot(element);
    root.render(<Component {...props} />);
    mountedComponents.set(elementId, root);
    console.log(`Successfully rendered ${Component.name}`);
  } catch (error) {
    console.error(`Error rendering ${Component.name}:`, error);
  }
}

// Initialize React components on page load
const initializeReactComponents = () => {
  // Clean up any existing mounted components
  mountedComponents.forEach((root, elementId) => {
    root.unmount();
    mountedComponents.delete(elementId);
  });

  const routineFormElement = document.getElementById("routine-form-container");
  if (routineFormElement) {
    let initialExercises = [];
    let isEditPage = false;

    // Log raw attribute values for debugging
    const initialExercisesAttr = routineFormElement.getAttribute(
      "data-initial-exercises",
    );
    const isEditPageAttr = routineFormElement.getAttribute("data-is-edit-page");
    console.log("Initial Exercises Attribute:", initialExercisesAttr);
    console.log("Is Edit Page Attribute:", isEditPageAttr);

    // Safely parse data-initial-exercises
    if (initialExercisesAttr) {
      try {
        initialExercises = JSON.parse(initialExercisesAttr);
        // Ensure it's an array
        if (!Array.isArray(initialExercises)) {
          console.error("data-initial-exercises should be an array.");
          initialExercises = [];
        }
      } catch (error) {
        console.error("Failed to parse data-initial-exercises:", error);
        initialExercises = [];
      }
    }

    // Safely parse data-is-edit-page
    if (isEditPageAttr) {
      isEditPage = isEditPageAttr === "true";
    }

    renderComponent(RoutineForm, "routine-form-container", {
      initialExercises,
      isEditPage
    });
  }

  const logFormElement = document.getElementById("log-form-container");
  if (logFormElement) {
    renderComponent(LogForm, "log-form-container");
  }

  const boardElement = document.getElementById("board-container");
  if (boardElement) {
    renderComponent(Board, "board-container");
  }

  const tasksChartElement = document.getElementById("tasks-chart-container");
  if (tasksChartElement) {
    renderComponent(TasksChart, "tasks-chart-container");
  }

  const heartIconElements = document.querySelectorAll(".heart-icon");
  heartIconElements.forEach((element) => {
    const goalId = parseInt(element.getAttribute("data-goal-id"), 10);
    const initialFavourite = element.getAttribute("data-initial-favourite") === "true";
    
    // Create a unique ID if one doesn't exist
    if (!element.id) {
      element.id = `heart-icon-${goalId}`;
    }
    
    renderComponent(HeartIcon, element.id, {
      goalId,
      initialFavourite
    });
  });

  const completeGoalButtonElements = document.querySelectorAll(".complete-goal-button");
  completeGoalButtonElements.forEach((element) => {
    const goalId = parseInt(element.getAttribute("data-goal-id"), 10);
    renderComponent(CompleteGoalButton, element.id || `complete-goal-button-${goalId}`, {
      goalId
    });
  });

  const editTaskFormElements = document.querySelectorAll(".edit-task-form");
  editTaskFormElements.forEach((element) => {
    const taskId = parseInt(element.getAttribute("data-task-id"), 10);
    renderComponent(EditTaskForm, element.id || `edit-task-form-${taskId}`, {
      taskId
    });
  });

  const modalElement = document.getElementById("modal-container");
  if (modalElement) {
    renderComponent(Modal, "modal-container");
  }

  const goalProgressElements = document.querySelectorAll(".goal-progress");
  goalProgressElements.forEach((element) => {
    const goalId = parseInt(element.getAttribute("data-goal-id"), 10);
    const progress = parseInt(element.getAttribute("data-progress"), 10);
    renderComponent(GoalProgress, element.id || `goal-progress-${goalId}`, {
      goalId,
      progress
    });
  });

  const habitLogFormElements = document.querySelectorAll(".habit-log-form");
  habitLogFormElements.forEach((element) => {
    const habitId = parseInt(element.getAttribute("data-habit-id"), 10);
    renderComponent(HabitLogForm, element.id || `habit-log-form-${habitId}`, {
      habitId
    });
  });

  const exerciseDirectoryElement = document.getElementById("exercise-directory-container");
  if (exerciseDirectoryElement) {
    renderComponent(ExerciseDirectory, "exercise-directory-container");
  }

  const boardRootElement = document.getElementById("board-root");
  if (boardRootElement) {
    const goalId = parseInt(boardRootElement.getAttribute("data-goal-id"), 10);
    renderComponent(GoalShow, "board-root", {
      goalId
    });
  }

  const transactionsTableElement = document.getElementById("transactions-table-container");
  if (transactionsTableElement) {
    const initialTransactions = JSON.parse(transactionsTableElement.getAttribute("data-transactions") || "[]");
    const accounts = JSON.parse(transactionsTableElement.getAttribute("data-accounts") || "[]");
    
    renderComponent(TransactionsTable, "transactions-table-container", {
      initialTransactions,
      accounts
    });
  }
};

// Initialize components when the page loads
document.addEventListener('DOMContentLoaded', initializeReactComponents);

// Re-initialize components after Turbo navigation
document.addEventListener('turbo:load', initializeReactComponents);

// Function to toggle task visibility
const toggleTasks = (goalId) => {
  const tasksElement = document.getElementById(`tasks-${goalId}`);
  tasksElement?.classList.toggle("hidden");
};

// Modal management
let modalRoot = null;

const openEditTaskModal = async (task) => {
  const modalContainer = document.getElementById("edit-task-form-container");
  if (!modalContainer) return;

  if (!modalRoot) {
    modalRoot = createRoot(modalContainer);
  }

  const { default: Modal } = await import("./components/Modal");
  const { default: EditTaskForm } = await import("./components/EditTaskForm");

  modalRoot.render(
    <Modal show={true} onClose={closeEditTaskModal}>
      <EditTaskForm task={task} onSave={handleSave} />
    </Modal>
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
      console.error("Failed to save task:", error);
    });
};

const saveTask = (task) => {
  return fetch(`/objectives/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
    },
    body: JSON.stringify(task),
  }).then((response) => response.json());
};

const initializeNavDropdowns = () => {
  const dropdowns = [
    { button: "finances-menu-button", dropdown: "finances-menu-dropdown" },
    { button: "fitness-menu-button", dropdown: "fitness-menu-dropdown" },
    { button: "goals-menu-button", dropdown: "goals-menu-dropdown" },
  ];

  const closeOtherDropdowns = (currentDropdown) => {
    dropdowns.forEach(({ dropdown }) => {
      const menuDropdown = document.getElementById(dropdown);
      if (menuDropdown && menuDropdown !== currentDropdown) {
        menuDropdown.classList.add("hidden");
        const relatedButton = dropdowns.find(
          (d) => d.dropdown === dropdown,
          )?.button;
        if (relatedButton) {
          const button = document.getElementById(relatedButton);
          button?.setAttribute("aria-expanded", "false");
        }
      }
    });
  };

  const handleButtonClick = (event, menuButton, menuDropdown) => {
    event.stopPropagation();
    menuDropdown.classList.toggle("hidden");
    const isExpanded = !menuDropdown.classList.contains("hidden");
    menuButton.setAttribute("aria-expanded", isExpanded);
    closeOtherDropdowns(menuDropdown);
  };

  const setupDropdown = ({ button, dropdown }) => {
    const menuButton = document.getElementById(button);
    const menuDropdown = document.getElementById(dropdown);

    if (menuButton && menuDropdown) {
      menuButton.removeEventListener("click", menuButton.clickHandler);
      menuButton.clickHandler = (event) =>
      handleButtonClick(event, menuButton, menuDropdown);
      menuButton.addEventListener("click", menuButton.clickHandler);
    }
  };

  dropdowns.forEach(setupDropdown);

  // Close dropdowns when clicking outside
  document.removeEventListener("click", document.closeDropdownsHandler);
  document.closeDropdownsHandler = (event) => {
    dropdowns.forEach(({ button, dropdown }) => {
      const menuButton = document.getElementById(button);
      const menuDropdown = document.getElementById(dropdown);

      if (
        menuDropdown &&
        menuButton &&
        !menuButton.contains(event.target) &&
        !menuDropdown.contains(event.target)
        ) {
        menuDropdown.classList.add("hidden");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
  };
  document.addEventListener("click", document.closeDropdownsHandler);
};

// Initialize Theme Management
const initializeTheme = () => {
  const themeToggleCheckbox = document.getElementById("theme-toggle");

  if (!themeToggleCheckbox) {
    console.error("Theme toggle checkbox not found!");
    return;
  }

  /**
   * Sets the theme based on the checkbox state.
   * @param {boolean} isDark - Indicates if the theme should be dark.
   */
  const setTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      console.log("Dark mode enabled.");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      console.log("Light mode enabled.");
    }
  };

  /**
   * Initializes the checkbox state based on the current theme.
   * This function assumes that the inline script in the head has already set the correct theme class.
   */
  const initializeCheckbox = () => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
      ).matches;

    console.log("Stored theme:", storedTheme);
    console.log("System prefers dark:", prefersDark);

    if (storedTheme === "dark" || (storedTheme === null && prefersDark)) {
      themeToggleCheckbox.checked = true;
      setTheme(true);
    } else {
      themeToggleCheckbox.checked = false;
      setTheme(false);
    }

    console.log("Checkbox checked state:", themeToggleCheckbox.checked);
  };

  // Listen for changes on the checkbox to toggle the theme
  themeToggleCheckbox.addEventListener("change", (event) => {
    setTheme(event.target.checked);
    console.log("Checkbox toggled:", event.target.checked);
  });

  // Initialize the checkbox on page load
  initializeCheckbox();
};

// Synchronize theme across tabs
const synchronizeThemeAcrossTabs = () => {
  window.addEventListener("storage", (event) => {
    if (event.key === "theme") {
      const isDark = event.newValue === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      const themeToggleCheckbox = document.getElementById("theme-toggle");
      if (themeToggleCheckbox) {
        themeToggleCheckbox.checked = isDark;
        console.log(
          "Theme synchronized across tabs:",
          isDark ? "Dark" : "Light",
          );
      }
    }
  });
};

// Initialize all functionalities on turbo:load
document.addEventListener("turbo:load", () => {
  initializeReactComponents();
  initializeNavDropdowns();
  initializeTheme();
  synchronizeThemeAcrossTabs();
});

document.addEventListener("turbo:render", () => {
  initializeNavDropdowns();
});

// Expose global functions if necessary
window.toggleTasks = toggleTasks;
window.openEditTaskModal = openEditTaskModal;
window.closeEditTaskModal = closeEditTaskModal;
