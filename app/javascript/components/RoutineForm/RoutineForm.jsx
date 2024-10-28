// components/Forms/RoutineForm/RoutineForm.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import ExerciseItem from "./ExerciseItem";
import InlineButton from "../Common/InlineButton";
import { Plus } from "lucide-react";
import isEqual from "lodash/isEqual";
import { Dumbbell, Timer, Heart } from "lucide-react";

/**
 * RoutineForm Component
 * Allows users to create and manage their workout routines with exercises and sets.
 */
const RoutineForm = ({ initialExercises = [], isEditPage = false }) => {
  const [routineExercises, setRoutineExercises] = useState([]);
  const isInitialMount = useRef(true);

  // Initialize routine exercises on mount or when initialExercises/isEditPage changes
  useEffect(() => {
    if (isInitialMount.current) {
      let newExercises;
      if (isEditPage && initialExercises.length > 0) {
        // Inside useEffect
        newExercises = initialExercises.map((exercise) => ({
          id: exercise.id, // Include the routine_exercise id
          exercise_id: exercise.exercise_id,
          exercise_name: exercise.exercise_name,
          exercise_type_id: exercise.exercise_type_id,
          isSelected: true,
          collapsed: false,
          quickSetMode: false,
          showExerciseSearch: false,
          routine_sets: (exercise.routine_sets || []).map((set) => ({
            id: set.id, // Include the routine_set id
            reps: set.reps,
            weight: set.weight,
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
            routine_sets: [{ reps: "", weight: "" }],
            isSelected: false,
            collapsed: false,
            quickSetMode: false,
            showExerciseSearch: true,
          },
        ];
      }

      setRoutineExercises(newExercises);
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
          routine_sets: (exercise.routine_sets || []).map((set) => ({
            id: set.id,
            reps: set.reps,
            weight: set.weight,
            duration: set.duration,
            distance: set.distance,
            style: set.style,
            intensity: set.intensity,
          })),
        }));

        // Only update if there is a difference to prevent unnecessary re-renders
        if (!isEqual(newExercises, routineExercises)) {
          setRoutineExercises(newExercises);
        }
      }
    }
    // Removed routineExercises from dependency array
  }, [initialExercises, isEditPage]);

  // Exercise type icons
  const getExerciseTypeIcon = useCallback((typeId) => {
    const icons = {
      1: <Heart className="w-5 h-5 text-white" />,
      2: <Dumbbell className="w-5 h-5 text-white" />,
      3: <Timer className="w-5 h-5 text-white" />,
    };
    return icons[typeId] || icons[2];
  }, []);

  // Exercise management functions
  const addExercise = useCallback(() => {
    // Only add a new exercise if the last one is selected to prevent empty entries
    if (routineExercises[routineExercises.length - 1]?.isSelected) {
      setRoutineExercises((prev) => [
        ...prev,
        {
          exercise_id: "",
          exercise_name: "",
          exercise_type_id: "",
          routine_sets: [{ reps: "", weight: "" }],
          isSelected: false,
          collapsed: false,
          quickSetMode: false,
          showExerciseSearch: true,
        },
      ]);
    } else {
      alert("Please select an exercise before adding a new one.");
    }
  }, [routineExercises]);

  const handleExerciseSelect = useCallback((exercise, index) => {
    setRoutineExercises((prev) => {
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

  const handleExerciseSearchToggle = useCallback((index, show) => {
    setRoutineExercises((prev) => {
      const updated = [...prev];
      updated[index].showExerciseSearch = show;
      return updated;
    });
  }, []);

  // Set management functions
  const addSet = useCallback((exerciseIndex) => {
    setRoutineExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].routine_sets.push({ reps: "", weight: "" });
      return updated;
    });
  }, []);

  const removeSet = useCallback((exerciseIndex, setIndex) => {
    setRoutineExercises((prev) => {
      const updated = [...prev];
      const setToRemove = updated[exerciseIndex].routine_sets[setIndex];

      if (setToRemove.id) {
        // Existing record, mark for destruction
        setToRemove._destroy = true;
      } else {
        // New record, remove from array
        updated[exerciseIndex].routine_sets.splice(setIndex, 1);
      }
      return updated;
    });
  }, []);

  // UI state management
  const toggleCollapse = useCallback((index) => {
    setRoutineExercises((prev) => {
      const updated = [...prev];
      updated[index].collapsed = !updated[index].collapsed;
      return updated;
    });
  }, []);

  const toggleQuickSetMode = useCallback((index) => {
    setRoutineExercises((prev) => {
      const updated = [...prev];
      updated[index].quickSetMode = !updated[index].quickSetMode;
      return updated;
    });
  }, []);

  // Form handling
  const handleSetChange = useCallback((e, exerciseIndex, setIndex, field) => {
    const value = e.target.value;
    setRoutineExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].routine_sets[setIndex][field] = value;
      return updated;
    });
  }, []);

  const handleQuickSetChange = useCallback((e, exerciseIndex, field) => {
    const value = e.target.value;
    setRoutineExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex][field] = value;
      return updated;
    });
  }, []);

  const generateSets = useCallback(
    (exerciseIndex) => {
      const exercise = routineExercises[exerciseIndex];
      const { sets, reps, weight } = exercise;

      if (sets && reps && weight) {
        const numberOfSets = parseInt(sets, 10);
        if (isNaN(numberOfSets) || numberOfSets <= 0) {
          alert("Please enter a valid number of sets.");
          return;
        }

        setRoutineExercises((prev) => {
          const updated = [...prev];
          updated[exerciseIndex].routine_sets = Array(numberOfSets)
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
    [routineExercises],
  );

  return (
    <div className="flex flex-col gap-5">
      {routineExercises.map((exercise, index) => (
        <ExerciseItem
          key={index}
          exercise={exercise}
          index={index}
          getExerciseTypeIcon={getExerciseTypeIcon}
          handleExerciseSelect={handleExerciseSelect}
          handleExerciseSearchToggle={handleExerciseSearchToggle}
          toggleCollapse={toggleCollapse}
          toggleQuickSetMode={toggleQuickSetMode}
          addSet={addSet}
          removeSet={removeSet}
          handleSetChange={handleSetChange}
          handleQuickSetChange={handleQuickSetChange}
          generateSets={generateSets}
        />
      ))}

      {/* Add Exercise Button */}
      <div className="max-w-2xl">
        <InlineButton type="button" onClick={addExercise}>
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </InlineButton>
      </div>
    </div>
  );
};

// Define PropTypes for RoutineForm
RoutineForm.propTypes = {
  initialExercises: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number, // Exercise ID in database
      exercise_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      exercise_name: PropTypes.string.isRequired,
      exercise_type_id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      routine_sets: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number, // Set ID in database
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
  ).isRequired, // Ensure it's required if routineExercises should always be an array
  isEditPage: PropTypes.bool,
};

export default RoutineForm;
