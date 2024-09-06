import React, { useState, useEffect } from 'react';
import ExerciseSearch from './ExerciseSearch';

function LogForm({ initialExercises = [], isEditPage = false }) {
  const [fitnessLogExercises, setFitnessLogExercises] = useState([]);
  const [showExerciseSearch, setShowExerciseSearch] = useState(!isEditPage);

  useEffect(() => {
    console.log('Initial Exercises:', initialExercises);
    console.log('Is Edit Page:', isEditPage);

    if (isEditPage && initialExercises.length > 0) {
      // If it's the edit page, use the provided initial exercises
      const formattedExercises = initialExercises.map(exercise => ({
        exercise_id: exercise.id,  // Adjust according to your data structure
        exercise_name: exercise.exercise_name,  // Adjust according to your data structure
        exercise_type_id: exercise.exercise_type_id,
        fitness_log_sets: exercise.fitness_log_sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          duration: set.duration,
          distance: set.distance,
          style: set.style,
          intensity: set.intensity,
        })),
        isSelected: true,
        collapsed: false,
      }));
      setFitnessLogExercises(formattedExercises);
    } else {
      // If it's the new page or no exercises are provided
      setFitnessLogExercises([{
        exercise_id: '',
        exercise_name: '',
        exercise_type_id: '',
        fitness_log_sets: [{ reps: '', weight: '' }],
        isSelected: false,
        collapsed: false,
      }]);
      setShowExerciseSearch(true);
    }
  }, [initialExercises, isEditPage]);

  const addExercise = () => {
    if (fitnessLogExercises[fitnessLogExercises.length - 1]?.isSelected) {
      setFitnessLogExercises(prevExercises => [
        ...prevExercises,
        {
          exercise_id: '',
          exercise_name: '',
          exercise_type_id: '',
          fitness_log_sets: [{ reps: '', weight: '' }],
          isSelected: false,
          collapsed: false,
        },
      ]);
      setShowExerciseSearch(true);
    }
  };

  const handleExerciseSelect = (exercise, exerciseIndex) => {
    setFitnessLogExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        exercise_type_id: exercise.exercise_type_id,
        isSelected: true,
      };
      return updatedExercises;
    });
    setShowExerciseSearch(false);
  };

  const addSet = (exerciseIndex) => {
    setFitnessLogExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].fitness_log_sets.push({ reps: '', weight: '' });
      return updatedExercises;
    });
  };

  const toggleCollapse = (exerciseIndex) => {
    setFitnessLogExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].collapsed = !updatedExercises[exerciseIndex].collapsed;
      return updatedExercises;
    });
  };

  const handleChange = (e, exerciseIndex, setIndex, field) => {
    setFitnessLogExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].fitness_log_sets[setIndex][field] = e.target.value;
      return updatedExercises;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', fitnessLogExercises);
    // Add your form submission logic here (e.g., API call)
  };

  const getTableHeaders = (exerciseTypeId) => {
    switch (exerciseTypeId) {
      case 1: // Cardio
        return ['Duration (min)', 'Distance (km)'];
      case 2: // Strength Training
        return ['Reps', 'Weight (kg)'];
      case 3: // Yoga
        return ['Style', 'Duration (min)'];
      case 4: // HIIT
        return ['Intensity', 'Duration (min)'];
      case 5: // Stretching
        return ['Duration (min)'];
      default:
        return ['Field 1', 'Field 2'];
    }
  };

  const renderCustomFields = (exerciseTypeId, setIndex, exerciseIndex) => {
    switch (exerciseTypeId) {
      case 1: // Cardio
        return (
          <>
            <td>
              <input
                type="text"
                placeholder="0"
                value={fitnessLogExercises[exerciseIndex].fitness_log_sets[setIndex].duration || ''}
                onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'duration')}
                className="bg-sky-700 whitespace-nowrap px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20 placeholder-gray-100"
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="0"
                value={fitnessLogExercises[exerciseIndex].fitness_log_sets[setIndex].distance || ''}
                onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'distance')}
                className="bg-sky-700 whitespace-nowrap px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20 placeholder-gray-100"
              />
            </td>
          </>
        );
      case 2: // Strength Training
        return (
          <>
            <td>
              <input
                type="text"
                placeholder="0"
                value={fitnessLogExercises[exerciseIndex].fitness_log_sets[setIndex].reps || ''}
                onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'reps')}
                className="bg-sky-700 whitespace-nowrap px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20 placeholder-gray-100"
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="0"
                value={fitnessLogExercises[exerciseIndex].fitness_log_sets[setIndex].weight || ''}
                onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'weight')}
                className="bg-sky-700 whitespace-nowrap px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20 placeholder-gray-100"
              />
            </td>
          </>
        );
      case 3: // Yoga
        return (
          <>
            <td>
              <input
                type="text"
                placeholder="Style"
                value={fitnessLogExercises[exerciseIndex].fitness_log_sets[setIndex].style || ''}
                onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'style')}
                className="bg-sky-700 whitespace-nowrap px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20 placeholder-gray-100"
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="0"
                value={fitnessLogExercises[exerciseIndex].fitness_log_sets[setIndex].duration || ''}
                onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'duration')}
                className="bg-sky-700 whitespace-nowrap px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20 placeholder-gray-100"
              />
            </td>
          </>
        );
      case 4: // HIIT
        return (
          <>
            <td>
              <input
                type="text"
                placeholder="0"
                value={fitnessLogExercises[exerciseIndex].fitness_log_sets[setIndex].intensity || ''}
                onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'intensity')}
                className="bg-sky-700 whitespace-nowrap px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20 placeholder-gray-100"
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="0"
                value={fitnessLogExercises[exerciseIndex].fitness_log_sets[setIndex].duration || ''}
                onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'duration')}
                className="bg-sky-700 whitespace-nowrap px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20 placeholder-gray-100"
              />
            </td>
          </>
        );
      case 5: // Stretching
        return (
          <td colSpan="2">
            <input
              type="text"
              placeholder="0"
              value={fitnessLogExercises[exerciseIndex].fitness_log_sets[setIndex].duration || ''}
              onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'duration')}
              className="bg-sky-700 whitespace-nowrap px-2 py-1 rounded-md border-0 active:ring-0 focus:ring-0 w-20 placeholder-gray-100"
            />
          </td>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-row gap-5">
      {fitnessLogExercises.map((exercise, exerciseIndex) => (
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
                {fitnessLogExercises[exerciseIndex].exercise_name}
              </div>
            )}
            {exercise.exercise_id && (
              <>
                <button
                  type="button"
                  onClick={() => toggleCollapse(exerciseIndex)}
                  className="flex items-center justify-center gap-1 font-medium bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-md w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  {exercise.collapsed ? 'Expand' : 'Collapse'} Sets
                </button>

                {!exercise.collapsed && (
                  <div className="flex flex-col items-end gap-3">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          {getTableHeaders(exercise.exercise_type_id).map((header, index) => (
                            <th key={index} className="text-white text-left">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-sky-700 px-2 py-1">
                        {exercise.fitness_log_sets.map((set, setIndex) => (
                          <tr key={setIndex} className="px-2">
                            {renderCustomFields(exercise.exercise_type_id, setIndex, exerciseIndex)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
      <div className="flex flex-col justify-start">
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
      </div>
    </form>
  );
}

export default LogForm;
