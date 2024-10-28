import "@hotwired/turbo-rails";
import Rails from "@rails/ujs";
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

import "chart.js/auto";
import "chartkick/chart.js";

Rails.start();

// Function to render React components
const renderComponent = (elementId, Component, props = {}) => {
  const element = document.getElementById(elementId);
  if (element) {
    const root = createRoot(element);
    root.render(
      <Router>
        <Component {...props} />
      </Router>,
    );
  }
};

// Initialize React components on page load
const initializeReactComponents = () => {
  renderComponent("root", App);

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
      try {
        isEditPage = JSON.parse(isEditPageAttr);
        // Ensure it's a boolean
        if (typeof isEditPage !== "boolean") {
          console.error("data-is-edit-page should be a boolean.");
          isEditPage = false;
        }
      } catch (error) {
        console.error("Failed to parse data-is-edit-page:", error);
        isEditPage = false;
      }
    }

    renderComponent("routine-form-container", RoutineForm, {
      initialExercises,
      isEditPage,
    });
  }

  const logFormElement = document.getElementById("log-form-container");
  if (logFormElement) {
    const logData = logFormElement.getAttribute("data-log-data");
    const initialExercises = logData
      ? JSON.parse(logData).fitness_log_exercises
      : [];
    const isEditPage = logFormElement.getAttribute("data-is-edit") === "true";
    renderComponent("log-form-container", LogForm, {
      initialExercises,
      isEditPage,
    });
  }

  const boardRootElement = document.getElementById("board-root");
  if (boardRootElement) {
    const goalId = boardRootElement.getAttribute("data-goal-id");
    renderComponent("board-root", Board, { goalId });
  }

  renderComponent("tasks-chart-container", TasksChart);

  document.querySelectorAll(".heart-icon").forEach((div) => {
    const goalId = parseInt(div.getAttribute("data-goal-id"), 10);
    const initialFavourite =
      div.getAttribute("data-initial-favourite") === "true";
    const root = createRoot(div);
    root.render(
      <HeartIcon goalId={goalId} initialFavourite={initialFavourite} />,
    );
  });

  const completeGoalButtonElement = document.getElementById(
    "complete-goal-button",
  );
  if (completeGoalButtonElement) {
    const goalId = parseInt(
      completeGoalButtonElement.getAttribute("data-goal-id"),
      10,
    );
    const root = createRoot(completeGoalButtonElement);
    root.render(<CompleteGoalButton goalId={goalId} />);
  }

  document.querySelectorAll(".goal-progress").forEach((div) => {
    const progress = parseInt(div.getAttribute("data-progress"), 10);
    const root = createRoot(div);
    root.render(<GoalProgress progress={progress} />);
  });

  document.querySelectorAll(".habit-log-form").forEach((div) => {
    const habitId = div.getAttribute("data-habit-id");
    if (habitId) {
      const root = createRoot(div);
      root.render(<HabitLogForm habitId={habitId} />);
    } else {
      console.error("Missing habitId. Cannot render HabitLogForm.");
    }
  });
};

// Function to toggle task visibility
const toggleTasks = (goalId) => {
  const tasksElement = document.getElementById(`tasks-${goalId}`);
  tasksElement?.classList.toggle("hidden");
};

// Modal management
let modalRoot = null;

const openEditTaskModal = (task) => {
  const modalContainer = document.getElementById("edit-task-form-container");
  if (!modalRoot && modalContainer) {
    modalRoot = createRoot(modalContainer);
  }
  if (modalRoot) {
    modalRoot.render(
      <Modal show={true} onClose={closeEditTaskModal}>
        <EditTaskForm task={task} onSave={handleSave} />
      </Modal>,
    );
  }
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
      "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content, // Include CSRF token
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
