import React, { useState, useEffect } from "react";
import ExerciseSearch from "../CommonFitness/ExerciseSearch";
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
    className={`
      inline-flex items-center 
      ${variant === "outline" 
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
    <div className={`w-8 h-4 ${checked ? "bg-primary-500" : "bg-gray-300"} rounded-full relative`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : ""}`} />
    </div>
  </label>
);

/**
 * LogForm Component
 * Allows users to log their fitness exercises with sets and related details.
 */
const LogForm = ({ initialExercises = [], isEditPage = false }) => {
  const [exercises, setExercises] = useState([]);

  // Initialize exercises on mount or when initialExercises/isEditPage changes
  useEffect(() => {
    if (isEditPage && initialExercises.length > 0) {
      setExercises(initialExercises.map(exercise => ({
        ...exercise,
        isSelected: true,
        collapsed: false,
        quickSetMode: false,
        showExerciseSearch: false,
        fitness_log_sets: exercise.fitness_log_sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          duration: set.duration,
          distance: set.distance,
          style: set.style,
          intensity: set.intensity,
        }))
      })));
    } else {
      setExercises([{
        exercise_id: "",
        exercise_name: "",
        exercise_type_id: "",
        fitness_log_sets: [{ reps: "", weight: "" }],
        isSelected: false,
        collapsed: false,
        quickSetMode: false,
        showExerciseSearch: true,
      }]);
    }
  }, [initialExercises, isEditPage]);

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
  const addExercise = () => {
    if (exercises[exercises.length - 1]?.isSelected) {
      setExercises(prev => [...prev, {
        exercise_id: "",
        exercise_name: "",
        exercise_type_id: "",
        fitness_log_sets: [{ reps: "", weight: "" }],
        isSelected: false,
        collapsed: false,
        quickSetMode: false,
        showExerciseSearch: true,
      }]);
    }
  };

  const handleExerciseSelect = (exercise, index) => {
    setExercises(prev => {
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
  };

  // Set management functions
  const addSet = (exerciseIndex) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex].fitness_log_sets.push({ reps: "", weight: "" });
      return updated;
    });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex].fitness_log_sets.splice(setIndex, 1);
      return updated;
    });
  };

  // UI state management
  const toggleCollapse = (index) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[index].collapsed = !updated[index].collapsed;
      return updated;
    });
  };

  const toggleQuickSetMode = (index) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[index].quickSetMode = !updated[index].quickSetMode;
      return updated;
    });
  };

  // Form handling
  const handleSetChange = (e, exerciseIndex, setIndex, field) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex].fitness_log_sets[setIndex][field] = e.target.value;
      return updated;
    });
  };

  const handleQuickSetChange = (e, exerciseIndex, field) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex][field] = e.target.value;
      return updated;
    });
  };

  const generateSets = (exerciseIndex) => {
    const exercise = exercises[exerciseIndex];
    const { sets, reps, weight } = exercise;

    if (sets && reps && weight) {
      setExercises(prev => {
        const updated = [...prev];
        updated[exerciseIndex].fitness_log_sets = Array(parseInt(sets)).fill({
          reps: reps.toString(),
          weight: weight.toString(),
        });
        return updated;
      });
    } else {
      alert("Please fill in Sets, Reps, and Weight to generate sets.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submission logic here
    console.log("Submitting:", exercises);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {exercises.map((exercise, index) => (
        <div key={index} className="w-full max-w-2xl">
          <div className="flex flex-col gap-4 p-6 bg-background-card-light dark:bg-background-card-dark rounded-lg shadow-sm">
            {/* Exercise Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500">
                  {getExerciseTypeIcon(exercise.exercise_type_id)}
                </div>
                <div>
                  <span className="text-lg font-medium">Exercise #{index + 1}</span>
                  {exercise.isSelected && exercise.exercise_name && (
                    <span className="block text-sm">{exercise.exercise_name}</span>
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
                      onClick={() => setExercises(prev => {
                        const updated = [...prev];
                        updated[index].showExerciseSearch = false;
                        return updated;
                      })}
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
                        onClick={() => setExercises(prev => {
                          const updated = [...prev];
                          updated[index].showExerciseSearch = true;
                          return updated;
                        })}
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
                  <div className="flex gap-2">
                    <InlineButton variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />Copy Last Workout
                    </InlineButton>
                    <InlineButton variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />Save as Template
                    </InlineButton>
                  </div>
                </div>

                {/* Quick Set Mode or Regular Sets */}
                {exercise.quickSetMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {['sets', 'reps', 'weight'].map(field => (
                        <div key={field} className="flex flex-col">
                          <label className="text-sm font-medium mb-2 capitalize">
                            {field}
                          </label>
                          <input
                            type="number"
                            className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2"
                            placeholder={field === 'sets' ? "3" : field === 'reps' ? "12" : "60"}
                            value={exercise[field] || ""}
                            onChange={(e) => handleQuickSetChange(e, index, field)}
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
                    <div className="bg-background-input-light dark:bg-background-input-dark rounded-lg p-4">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="text-sm font-medium">
                            <th className="px-2 py-1 text-left">Set</th>
                            <th className="px-2 py-1 text-left">Previous</th>
                            <th className="px-2 py-1 text-left">Reps</th>
                            <th className="px-2 py-1 text-left">Weight (kg)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.fitness_log_sets.map((set, setIndex) => (
                            <tr key={`${index}-${setIndex}`} className="border-t">
                              <td className="px-2 py-1 font-medium">{setIndex + 1}</td>
                              <td className="px-2 py-1 text-gray-500">
                                {set.reps && set.weight ? `${set.reps} × ${set.weight}kg` : "—"}
                              </td>
                              <td className="px-2 py-1">
                                <input
                                  type="number"
                                  placeholder="0"
                                  value={set.reps}
                                  onChange={(e) => handleSetChange(e, index, setIndex, "reps")}
                                  className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2 w-full"
                                />
                              </td>
                              <td className="px-2 py-1">
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="number"
                                    placeholder="0"
                                    value={set.weight}
                                    onChange={(e) => handleSetChange(e, index, setIndex, "weight")}
                                    className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2 w-full"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeSet(index, setIndex)}
                                    className="text-red-500 hover:text-red-600 p-1 rounded-md transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <InlineButton onClick={() => addSet(index)}>
                      <Plus className="w-4 h-4 mr-2" />Add Set
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
          <Plus className="w-4 h-4 mr-2" />Add Exercise
        </InlineButton>
      </div>
    </form>
  );
};

export default LogForm;
