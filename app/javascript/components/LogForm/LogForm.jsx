import React, { useState, useEffect, useRef, useCallback } from "react";
import ExerciseSearch from "../CommonFitness/ExerciseSearch";
import PropTypes from "prop-types";
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
import { isEqual } from "lodash";

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
    className={`
      inline-flex items-center 
      ${
        variant === "outline"
          ? "border border-primary-500 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900"
          : "bg-primary-500 text-white hover:bg-primary-600"
      }
      ${size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base"}
      font-medium rounded-md transition ${className}
      `}
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
      className="hidden"
    />
    <div
      className={`w-8 h-4 ${checked ? "bg-primary-500" : "bg-gray-300"} rounded-full relative`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : ""}`}
      />
    </div>
  </label>
);

/**
 * LogForm Component
 * Allows users to log their fitness exercises with sets and related details.
 */
const LogForm = ({ initialExercises = [], isEditPage = false }) => {
  const [exercises, setExercises] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const isInitialMount = useRef(true);

  // Initialize exercises on mount or when initialExercises/isEditPage changes
  useEffect(() => {
    if (isInitialMount.current) {
      let newExercises;
      if (isEditPage && initialExercises.length > 0) {
        newExercises = initialExercises.map((exercise) => ({
          id: exercise.id,
          exercise_id: exercise.exercise_id,
          exercise_name: exercise.exercise_name,
          exercise_type_id: exercise.exercise_type_id,
          isSelected: true,
          collapsed: false,
          quickSetMode: false,
          showExerciseSearch: false,
          fitness_log_sets: (exercise.fitness_log_sets || []).map((set) => ({
            id: set.id,
            reps: set.reps || "",
            weight: set.weight || "",
            duration: set.duration,
            distance: set.distance,
            style: set.style,
            intensity: set.intensity,
          })),
        }));
      } else {
        newExercises = [
          {
            exercise_id: "",
            exercise_name: "",
            exercise_type_id: "",
            fitness_log_sets: [{ reps: "", weight: "" }],
            isSelected: false,
            collapsed: false,
            quickSetMode: false,
            showExerciseSearch: true,
          },
        ];
      }

      setExercises(newExercises);
      isInitialMount.current = false;
    } else {
      // If not initial mount, handle updates based on props
      if (isEditPage && initialExercises.length > 0) {
        const newExercises = initialExercises.map((exercise) => ({
          ...exercise,
          isSelected: true,
          collapsed: false,
          quickSetMode: false,
          showExerciseSearch: false,
          fitness_log_sets: (exercise.fitness_log_sets || []).map((set) => ({
            id: set.id,
            reps: set.reps || "",
            weight: set.weight || "",
            duration: set.duration,
            distance: set.distance,
            style: set.style,
            intensity: set.intensity,
          })),
        }));

        // Only update if there is a difference to prevent unnecessary re-renders
        if (!isEqual(newExercises, exercises)) {
          setExercises(newExercises);
        }
      }
    }
  }, [initialExercises, isEditPage]);

  // Form validation
  const validateForm = useCallback(() => {
    const errors = [];

    exercises.forEach((exercise, index) => {
      if (!exercise.isSelected) {
        errors.push(`Exercise #${index + 1} must be selected`);
      }

      exercise.fitness_log_sets.forEach((set, setIndex) => {
        if (!set.reps || !set.weight) {
          errors.push(
            `Exercise #${index + 1}, Set #${setIndex + 1} must have both reps and weight`,
          );
        }
      });
    });

    setFormErrors(errors);
    return errors.length === 0;
  }, [exercises]);

  // Form submission handler
  const handleSubmit = useCallback(
    (e) => {
      if (!validateForm()) {
        e.preventDefault();
        return;
      }
    },
    [validateForm],
  );

  // Exercise type icons
  const getExerciseTypeIcon = (typeId) => {
    const icons = {
      1: <Heart className="w-5 h-5 text-white" />,
      2: <Dumbbell className="w-5 h-5 text-white" />,
      3: <Timer className="w-5 h-5 text-white" />,
    };
    return icons[typeId] || icons[2];
  };

  // Exercise management functions
  const addExercise = useCallback(() => {
    if (exercises[exercises.length - 1]?.isSelected) {
      setExercises((prev) => [
        ...prev,
        {
          exercise_id: "",
          exercise_name: "",
          exercise_type_id: "",
          fitness_log_sets: [{ reps: "", weight: "" }],
          isSelected: false,
          collapsed: false,
          quickSetMode: false,
          showExerciseSearch: true,
        },
      ]);
    } else {
      alert("Please select an exercise before adding a new one.");
    }
  }, [exercises]);

  const handleExerciseSelect = useCallback((exercise, index) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        exercise_type_id: exercise.exercise_type_id,
        isSelected: true,
        showExerciseSearch: false,
      };
      return updated;
    });
  }, []);

  // Set management functions
  const addSet = useCallback((exerciseIndex) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].fitness_log_sets.push({ reps: "", weight: "" });
      return updated;
    });
  }, []);

  const removeSet = useCallback((exerciseIndex, setIndex) => {
    setExercises((prev) => {
      const updated = [...prev];
      const setToRemove = updated[exerciseIndex].fitness_log_sets[setIndex];

      if (setToRemove.id) {
        // Existing record, mark for destruction
        setToRemove._destroy = true;
      } else {
        // New record, remove from array
        updated[exerciseIndex].fitness_log_sets.splice(setIndex, 1);
      }
      return updated;
    });
  }, []);

  // UI state management
  const toggleCollapse = (index) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[index].collapsed = !updated[index].collapsed;
      return updated;
    });
  };

  const toggleQuickSetMode = (index) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[index].quickSetMode = !updated[index].quickSetMode;
      return updated;
    });
  };

  // Form handling
  const handleSetChange = useCallback((e, exerciseIndex, setIndex, field) => {
    const value = e.target.value;
    setExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].fitness_log_sets[setIndex][field] = value;
      return updated;
    });
  }, []);

  const handleQuickSetChange = useCallback((e, exerciseIndex, field) => {
    const value = e.target.value;
    setExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex][field] = value;
      return updated;
    });
  }, []);

  const generateSets = useCallback(
    (exerciseIndex) => {
      const exercise = exercises[exerciseIndex];
      const { sets, reps, weight } = exercise;

      if (sets && reps && weight) {
        const numberOfSets = parseInt(sets, 10);
        if (isNaN(numberOfSets) || numberOfSets <= 0) {
          alert("Please enter a valid number of sets.");
          return;
        }

        setExercises((prev) => {
          const updated = [...prev];
          updated[exerciseIndex].fitness_log_sets = Array(numberOfSets)
            .fill(0)
            .map(() => ({
              reps: reps.toString(),
              weight: weight.toString(),
            }));
          return updated;
        });
      } else {
        alert("Please fill in Sets, Reps, and Weight to generate sets.");
      }
    },
    [exercises],
  );

  return (
    <div className="flex flex-col gap-5">
      {formErrors.length > 0 && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">
            Please fix the following errors:
          </strong>
          <ul className="mt-2 list-disc list-inside">
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {exercises.map((exercise, index) => (
        <div key={index} className="w-full max-w-2xl">
          {/* Add a hidden field to ensure empty arrays are sent */}
          <input
            type="hidden"
            name={`fitness_log_entry[fitness_log_exercises_attributes][${index}][_destroy]`}
            value="false"
          />

          <div className="flex flex-col gap-4 p-2 bg-background-card-light dark:bg-background-card-dark rounded-lg shadow-sm">
            {/* Exercise Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500">
                  {getExerciseTypeIcon(exercise.exercise_type_id)}
                </div>
                <div>
                  <span className="text-lg font-medium">
                    Exercise #{index + 1}
                  </span>
                  {exercise.isSelected && exercise.exercise_name && (
                    <span className="block text-sm">
                      {exercise.exercise_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Exercise Controls */}
              <div className="flex gap-2">
                {exercise.showExerciseSearch ? (
                  <>
                    <ExerciseSearch
                      onSelectExercise={(ex) => handleExerciseSelect(ex, index)}
                    />
                    <InlineButton
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExercises((prev) => {
                          const updated = [...prev];
                          updated[index].showExerciseSearch = false;
                          return updated;
                        })
                      }
                    >
                      Cancel
                    </InlineButton>
                  </>
                ) : (
                  exercise.isSelected && (
                    <>
                      <InlineButton
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExercises((prev) => {
                            const updated = [...prev];
                            updated[index].showExerciseSearch = true;
                            return updated;
                          })
                        }
                      >
                        Change Exercise
                      </InlineButton>
                      <InlineButton
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCollapse(index)}
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
                    </>
                  )
                )}
              </div>
            </div>

            {/* Hidden inputs for exercise_id and id */}
            {exercise.isSelected && (
              <>
                <input
                  type="hidden"
                  name={`fitness_log_entry[fitness_log_exercises_attributes][${index}][exercise_id]`}
                  value={exercise.exercise_id}
                />
                {exercise.id && (
                  <input
                    type="hidden"
                    name={`fitness_log_entry[fitness_log_exercises_attributes][${index}][id]`}
                    value={exercise.id}
                  />
                )}
              </>
            )}

            {/* Exercise Details */}
            {exercise.isSelected && !exercise.collapsed && (
              <div className="flex flex-col gap-4">
                {/* Quick Set Mode Toggle and Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Quick Set Mode</span>
                    <InlineSwitch
                      checked={exercise.quickSetMode}
                      onCheckedChange={() => toggleQuickSetMode(index)}
                    />
                  </div>
                </div>

                {/* Quick Set Mode or Regular Sets */}
                {exercise.quickSetMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {["sets", "reps", "weight"].map((field) => (
                        <div key={field} className="flex flex-col">
                          <label
                            htmlFor={`quick-${field}-${index}`}
                            className="text-sm font-medium mb-2 capitalize"
                          >
                            {field}
                          </label>
                          <input
                            id={`quick-${field}-${index}`}
                            type="number"
                            className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2"
                            placeholder={
                              field === "sets"
                                ? "3"
                                : field === "reps"
                                  ? "12"
                                  : "60"
                            }
                            value={exercise[field] || ""}
                            onChange={(e) =>
                              handleQuickSetChange(e, index, field)
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <InlineButton onClick={() => generateSets(index)}>
                      Generate Sets
                    </InlineButton>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-md">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-background-card dark:bg-background-card-dark">
                          <tr>
                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors">
                              Set
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors">
                              Previous
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors">
                              Reps
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
                              Weight
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium whitespace-nowrap text-text-light dark:text-text-dark uppercase tracking-wider">
                              <InlineButton onClick={() => addSet(index)}>
                                Add Set
                                <Plus className="w-4 h-4 ml-2" />
                              </InlineButton>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-background-light dark:bg-background-dark divide-y divide-gray-200 dark:divide-gray-700">
                          {exercise.fitness_log_sets.map((set, setIndex) => (
                            <tr>
                              {/* Add a hidden field to ensure empty arrays are sent */}
                              <input
                                type="hidden"
                                name={`fitness_log_entry[fitness_log_exercises_attributes][${index}][fitness_log_sets_attributes][${setIndex}][_destroy]`}
                                value="false"
                              />

                              {/* Hidden input for set id */}
                              {set.id && (
                                <input
                                  type="hidden"
                                  name={`fitness_log_entry[fitness_log_exercises_attributes][${index}][fitness_log_sets_attributes][${setIndex}][id]`}
                                  value={set.id}
                                />
                              )}
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                {setIndex + 1}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                {set.reps && set.weight
                                  ? `${set.reps} × ${set.weight}kg`
                                  : "—"}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                <input
                                  id={`set-${index}-${setIndex}-reps`}
                                  type="number"
                                  name={`fitness_log_entry[fitness_log_exercises_attributes][${index}][fitness_log_sets_attributes][${setIndex}][reps]`}
                                  placeholder="0"
                                  value={set.reps}
                                  onChange={(e) =>
                                    handleSetChange(e, index, setIndex, "reps")
                                  }
                                  className="rounded-md border-0 bg-background-card-light dark:bg-background-card-dark w-full"
                                />
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                <input
                                  type="number"
                                  name={`fitness_log_entry[fitness_log_exercises_attributes][${index}][fitness_log_sets_attributes][${setIndex}][weight]`}
                                  placeholder="0"
                                  value={set.weight}
                                  onChange={(e) =>
                                    handleSetChange(
                                      e,
                                      index,
                                      setIndex,
                                      "weight",
                                    )
                                  }
                                  className="rounded-md border-0 bg-background-card-light dark:bg-background-card-dark w-full"
                                />
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                                <button
                                  type="button"
                                  onClick={() => removeSet(index, setIndex)}
                                  className="text-red-500 hover:text-red-600 p-1 rounded-md transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
    </div>
  );
};

LogForm.propTypes = {
  initialExercises: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      exercise_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      exercise_name: PropTypes.string.isRequired,
      exercise_type_id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      fitness_log_sets: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          distance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          style: PropTypes.string,
          intensity: PropTypes.string,
        }),
      ).isRequired,
      isSelected: PropTypes.bool,
      collapsed: PropTypes.bool,
      quickSetMode: PropTypes.bool,
      showExerciseSearch: PropTypes.bool,
    }),
  ).isRequired,
  isEditPage: PropTypes.bool,
};

export default LogForm;
