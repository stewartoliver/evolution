import React, { useState, useEffect } from "react";
import ExerciseSearch from "./ExerciseSearch";
import {
  Dumbbell,
  Timer,
  Heart,
  ChevronDown,
  ChevronUp,
  Plus,
  Copy,
  Save,
  Trash2,
} from "lucide-react";

/**
 * InlineButton Component
 * A reusable button component with variants and sizes.
 */
const InlineButton = ({
  children,
  onClick,
  variant = "primary",
  size = "sm",
  className = "",
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center ${
      variant === "outline"
        ? "border border-primary-500 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900"
        : "bg-primary-500 text-white hover:bg-primary-600"
    } ${
      size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base"
    } font-medium rounded-md transition ${className}`}
  >
    {children}
  </button>
);

/**
 * InlineSwitch Component
 * A reusable switch (toggle) component.
 */
const InlineSwitch = ({ checked, onCheckedChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="toggle-switch hidden"
    />
    <div
      className={`w-8 h-4 ${
        checked ? "bg-primary-500" : "bg-gray-300"
      } rounded-full relative`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? "transform translate-x-4" : ""
        }`}
      />
    </div>
  </label>
);

/**
 * LogForm Component
 * Allows users to log their fitness exercises with sets and related details.
 */
function LogForm({ initialExercises = [], isEditPage = false }) {
  const [fitnessLogExercises, setFitnessLogExercises] = useState([]);

  // Initialize exercises on mount or when initialExercises/isEditPage changes
  useEffect(() => {
    if (isEditPage && initialExercises.length > 0) {
      const formattedExercises = initialExercises.map((exercise) => ({
        exercise_id: exercise.id,
        exercise_name: exercise.exercise_name,
        exercise_type_id: exercise.exercise_type_id,
        fitness_log_sets: exercise.fitness_log_sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
          duration: set.duration,
          distance: set.distance,
          style: set.style,
          intensity: set.intensity,
        })),
        isSelected: true,
        collapsed: false,
        quickSetMode: false, // Per-exercise Quick Set Mode
        showExerciseSearch: false, // Per-exercise Exercise Search visibility
      }));
      setFitnessLogExercises(formattedExercises);
    } else {
      setFitnessLogExercises([
        {
          exercise_id: "",
          exercise_name: "",
          exercise_type_id: "",
          fitness_log_sets: [{ reps: "", weight: "" }],
          isSelected: false,
          collapsed: false,
          quickSetMode: false, // Per-exercise Quick Set Mode
          showExerciseSearch: true, // Show Exercise Search for new exercise
        },
      ]);
    }
  }, [initialExercises, isEditPage]);

  // Add a new exercise
  const addExercise = () => {
    if (fitnessLogExercises[fitnessLogExercises.length - 1]?.isSelected) {
      setFitnessLogExercises((prevExercises) => [
        ...prevExercises,
        {
          exercise_id: "",
          exercise_name: "",
          exercise_type_id: "",
          fitness_log_sets: [{ reps: "", weight: "" }],
          isSelected: false,
          collapsed: false,
          quickSetMode: false, // Per-exercise Quick Set Mode
          showExerciseSearch: true, // Show Exercise Search for new exercise
        },
      ]);
    }
  };

  // Handle selecting an exercise from ExerciseSearch
  const handleExerciseSelect = (exercise, exerciseIndex) => {
    setFitnessLogExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        exercise_type_id: exercise.exercise_type_id,
        isSelected: true,
        showExerciseSearch: false, // Hide Exercise Search after selection
      };
      return updatedExercises;
    });
  };

  // Add a new set to an exercise
  const addSet = (exerciseIndex) => {
    setFitnessLogExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].fitness_log_sets.push({
        reps: "",
        weight: "",
      });
      return updatedExercises;
    });
  };

  // Remove a set from an exercise
  const removeSet = (exerciseIndex, setIndex) => {
    setFitnessLogExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].fitness_log_sets.splice(setIndex, 1);
      return updatedExercises;
    });
  };

  // Toggle collapse/expand of sets for an exercise
  const toggleCollapse = (exerciseIndex) => {
    setFitnessLogExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].collapsed =
        !updatedExercises[exerciseIndex].collapsed;
      return updatedExercises;
    });
  };

  // Toggle Quick Set Mode for an exercise
  const toggleQuickSetMode = (exerciseIndex) => {
    setFitnessLogExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].quickSetMode =
        !updatedExercises[exerciseIndex].quickSetMode;
      return updatedExercises;
    });
  };

  // Handle changes in set fields
  const handleChange = (e, exerciseIndex, setIndex, field) => {
    const value = e.target.value;
    setFitnessLogExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].fitness_log_sets[setIndex][field] =
        value;
      return updatedExercises;
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", fitnessLogExercises);
    // Add your form submission logic here (e.g., API call)
  };

  // Get the appropriate icon based on exercise type
  const getExerciseTypeIcon = (typeId) => {
    switch (typeId) {
      case 1:
        return <Heart className="w-5 h-5 text-white" />;
      case 2:
        return <Dumbbell className="w-5 h-5 text-white" />;
      case 3:
        return <Timer className="w-5 h-5 text-white" />;
      default:
        return <Dumbbell className="w-5 h-5 text-white" />;
    }
  };

  // Render a single set row
  const renderSetRow = (exerciseIndex, set, setIndex) => {
    return (
      <tr
        key={`${exerciseIndex}-${setIndex}`}
        className="border-t border-border-light dark:border-border-dark"
      >
        <td className="px-2 py-1 font-medium">{setIndex + 1}</td>
        <td className="px-2 py-1 text-gray-500">
          {set.reps && set.weight ? `${set.reps} × ${set.weight}kg` : "—"}
        </td>
        <td className="px-2 py-1">
          <input
            type="number"
            placeholder="0"
            value={set.reps || ""}
            onChange={(e) => handleChange(e, exerciseIndex, setIndex, "reps")}
            className="rounded-md border bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark font-medium text-sm focus:ring-0 w-full p-2"
          />
        </td>
        <td className="px-2 py-1">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="0"
              value={set.weight || ""}
              onChange={(e) =>
                handleChange(e, exerciseIndex, setIndex, "weight")
              }
              className="rounded-md border bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark font-medium text-sm focus:ring-0 w-full p-2"
            />
            <button
              type="button"
              onClick={() => removeSet(exerciseIndex, setIndex)}
              className="text-red-500 hover:text-red-600 p-1 rounded-md transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // Handle Quick Set Mode input changes
  const handleQuickSetChange = (e, exerciseIndex, field) => {
    const value = e.target.value;
    setFitnessLogExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex][field] = value;
      return updatedExercises;
    });
  };

  // Placeholder for Generate Sets functionality
  const generateSets = (exerciseIndex) => {
    // Implement your logic to generate sets based on Quick Set Mode inputs
    console.log("Generating sets for exercise index:", exerciseIndex);
    const exercise = fitnessLogExercises[exerciseIndex];
    const { sets, reps, weight } = exercise;

    if (sets && reps && weight) {
      const generatedSets = Array.from({ length: sets }, () => ({
        reps: reps.toString(),
        weight: weight.toString(),
      }));

      setFitnessLogExercises((prevExercises) => {
        const updatedExercises = [...prevExercises];
        updatedExercises[exerciseIndex].fitness_log_sets = generatedSets;
        return updatedExercises;
      });
    } else {
      alert("Please fill in Sets, Reps, and Weight to generate sets.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {fitnessLogExercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex} className="w-full max-w-2xl">
          <div className="flex flex-col gap-4 p-6 bg-background-card-light dark:bg-background-card-dark rounded-lg shadow-sm">
            {/* Exercise Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500">
                  {getExerciseTypeIcon(exercise.exercise_type_id)}
                </div>
                <div>
                  <span className="text-lg font-medium text-text-light dark:text-text-dark">
                    Exercise #{exerciseIndex + 1}
                  </span>
                  {exercise.isSelected && exercise.exercise_name && (
                    <span className="block text-sm text-text-light dark:text-text-dark">
                      {exercise.exercise_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {/* Exercise Search Component */}
                {exercise.showExerciseSearch && (
                  <ExerciseSearch
                    onSelectExercise={(ex) =>
                      handleExerciseSelect(ex, exerciseIndex)
                    }
                  />
                )}

                {/* Change Exercise Button */}
                {exercise.isSelected && (
                  <InlineButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFitnessLogExercises((prevExercises) => {
                        const updatedExercises = [...prevExercises];
                        updatedExercises[exerciseIndex].showExerciseSearch = true;
                        return updatedExercises;
                      });
                    }}
                  >
                    Change Exercise
                  </InlineButton>
                )}

                {/* Collapse/Expand Sets Button */}
                {exercise.isSelected && (
                  <InlineButton
                    onClick={() => toggleCollapse(exerciseIndex)}
                    variant="outline"
                    size="sm"
                  >
                    {exercise.collapsed ? (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Expand Sets
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Collapse Sets
                      </>
                    )}
                  </InlineButton>
                )}
              </div>
            </div>

            {/* Exercise Details */}
            {exercise.isSelected && !exercise.collapsed && (
              <div className="flex flex-col gap-4">
                {/* Quick Set Mode and Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Quick Set Mode</span>
                    <InlineSwitch
                      checked={exercise.quickSetMode}
                      onCheckedChange={() => toggleQuickSetMode(exerciseIndex)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <InlineButton variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Last Workout
                    </InlineButton>
                    <InlineButton variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save as Template
                    </InlineButton>
                  </div>
                </div>

                {/* Sets Table or Quick Set Mode Inputs */}
                {exercise.quickSetMode ? (
                  // Quick Set Mode Inputs
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2">Sets</label>
                        <input
                          type="number"
                          className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2"
                          placeholder="3"
                          value={exercise.sets || ""}
                          onChange={(e) =>
                            handleQuickSetChange(e, exerciseIndex, "sets")
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2">Reps</label>
                        <input
                          type="number"
                          className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2"
                          placeholder="12"
                          value={exercise.reps || ""}
                          onChange={(e) =>
                            handleQuickSetChange(e, exerciseIndex, "reps")
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2"
                          placeholder="60"
                          value={exercise.weight || ""}
                          onChange={(e) =>
                            handleQuickSetChange(e, exerciseIndex, "weight")
                          }
                        />
                      </div>
                    </div>
                    <InlineButton
                      onClick={() => generateSets(exerciseIndex)}
                    >
                      Generate Sets
                    </InlineButton>
                  </div>
                ) : (
                  // Regular Sets Table
                  <div className="space-y-4">
                    <div className="bg-background-input-light dark:bg-background-input-dark rounded-lg p-4">
                      <table className="w-full min-w-full table-auto divide-y divide-border-light dark:divide-border-dark">
                        <thead>
                          <tr className="text-sm font-medium text-text-light dark:text-text-dark bg-background-input-light dark:bg-background-input-dark">
                            <th className="px-2 py-1 text-left">Set</th>
                            <th className="px-2 py-1 text-left">Previous</th>
                            <th className="px-2 py-1 text-left">Reps</th>
                            <th className="px-2 py-1 text-left">Weight (kg)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.fitness_log_sets.map((set, setIndex) =>
                            renderSetRow(exerciseIndex, set, setIndex)
                          )}
                        </tbody>
                      </table>
                    </div>
                    <InlineButton onClick={() => addSet(exerciseIndex)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Set
                    </InlineButton>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Exercise Button */}
      <div className="max-w-2xl">
        <InlineButton onClick={addExercise}>
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </InlineButton>
      </div>
    </form>
  );
}

export default LogForm;
