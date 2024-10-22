import React, { useState, useEffect } from 'react';
import ExerciseSearch from './ExerciseSearch'; // Assuming you're using the same ExerciseSearch component

function RoutineForm({ initialExercises = [], isEditPage = false }) {
  const [routineExercises, setRoutineExercises] = useState([]);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);

  useEffect(() => {
    if (isEditPage && initialExercises.length > 0) {
      // Format initial exercises for edit page
      const formattedExercises = initialExercises.map(exercise => ({
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        routine_sets: exercise.routine_sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
        })),
        isSelected: true,
        collapsed: false,
      }));
      setRoutineExercises(formattedExercises);
    } else {
      // Set up for new routine
      setRoutineExercises([{
        exercise_id: '',
        exercise_name: '',
        routine_sets: [{ reps: '', weight: '' }],
        isSelected: false,
        collapsed: false,
      }]);
      setShowExerciseSearch(true); // Show search initially
    }
  }, [initialExercises, isEditPage]);

  const addExercise = () => {
    // Always allow adding a new exercise, even if the previous one is not selected
    setRoutineExercises(prevExercises => [
      ...prevExercises,
      {
        exercise_id: '',
        exercise_name: '',
        routine_sets: [{ reps: '', weight: '' }],
        isSelected: false,
        collapsed: false,
      },
    ]);
    setShowExerciseSearch(true); // Ensure the search appears when a new exercise is added
  };

  const handleExerciseSelect = (exercise, exerciseIndex) => {
    setRoutineExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        isSelected: true,
      };
      return updatedExercises;
    });
    setShowExerciseSearch(false); // Hide search after selection
  };

  const addSet = (exerciseIndex) => {
    setRoutineExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].routine_sets.push({ reps: '', weight: '' });
      return updatedExercises;
    });
  };

  const toggleCollapse = (exerciseIndex) => {
    setRoutineExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].collapsed = !updatedExercises[exerciseIndex].collapsed;
      return updatedExercises;
    });
  };

  const handleChange = (e, exerciseIndex, setIndex, field) => {
    setRoutineExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].routine_sets[setIndex][field] = e.target.value;
      return updatedExercises;
    });
  };

  return (
    <form className="flex flex-wrap gap-5">
      {routineExercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex} className="flex flex-col w-min">
          <div className="flex items-center gap-3 rounded-t-md p-3 bg-sky-700">
            <div className="uppercase font-medium text-white">
              Exercise #{exerciseIndex + 1}
            </div>
          </div>
          <div className="flex flex-col gap-3 p-3 bg-sky-800 rounded-b-md text-sm whitespace-nowrap">
            {!exercise.isSelected && showExerciseSearch ? (
              <ExerciseSearch onSelectExercise={(exercise) => handleExerciseSelect(exercise, exerciseIndex)} />
            ) : (
              <div className="text-lg font-medium text-gray-200">
                {routineExercises[exerciseIndex].exercise_name}
              </div>
            )}

            {exercise.exercise_id && (
              <>
                <button
                  type="button"
                  onClick={() => toggleCollapse(exerciseIndex)}
                  className="flex items-center justify-center gap-1 font-medium bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-md w-full"
                >
                  {exercise.collapsed ? 'Expand' : 'Collapse'} Sets
                </button>

                {!exercise.collapsed && (
                  <div className="flex flex-col items-end gap-3">
                    {exercise.routine_sets.map((set, setIndex) => (
                      <div key={setIndex} className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="Reps"
                          value={set.reps || ''}
                          onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'reps')}
                          className="bg-sky-700 px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20"
                        />
                        <input
                          type="text"
                          placeholder="Weight (kg)"
                          value={set.weight || ''}
                          onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'weight')}
                          className="bg-sky-700 px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSet(exerciseIndex)}
                      className="flex items-center justify-center gap-1 font-medium bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-md w-full"
                    >
                      Add Set
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addExercise}
        className="flex items-center font-medium gap-1 sky-badge"
      >
        Add Exercise
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </form>
  );
}

export default RoutineForm;
