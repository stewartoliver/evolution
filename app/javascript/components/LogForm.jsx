import React, { useState, useEffect } from 'react';


function LogForm() {
  const [exercises, setExercises] = useState([]);
  const [fitnessLogExercises, setFitnessLogExercises] = useState([]);

  useEffect(() => {
    fetch('/fitness/exercises')
      .then((response) => response.json())
      .then((data) => setExercises(data))
      .catch((error) => console.error('Error fetching exercises:', error));

    setFitnessLogExercises([{ exercise_id: '', fitness_log_sets: [{ reps: '', weight: '' }] }]);
  }, []);

  const addExercise = () => {
    setFitnessLogExercises((prevExercises) => [
      ...prevExercises,
      { exercise_id: '', fitness_log_sets: [{ reps: '', weight: '' }] },
    ]);
  };

  const addSet = (exerciseIndex) => {
    setFitnessLogExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].fitness_log_sets.push({ reps: '', weight: '' });
      return updatedExercises;
    });
  };

  const handleChange = (e, exerciseIndex, setIndex, field) => {
    setFitnessLogExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].fitness_log_sets[setIndex][field] = e.target.value;
      return updatedExercises;
    });
  };

  return (
    <div className="space-y-4">
      {fitnessLogExercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex}>
          <div className="flex items-center gap-3 rounded-t-md border-gray-300 border-t border-x p-3 bg-sky-500/30">
            <div className="uppercase font-semibold text-sky-900">
              Exercise #{exerciseIndex + 1}
            </div>
          </div>
          <div className="flex flex-col gap-3 p-3 bg-sky-500/20 rounded-b-md border-gray-300 border-b border-x text-sm">
            <input
              type="hidden"
              name={`fitness_log_entry[fitness_log_exercises_attributes][${exerciseIndex}][id]`}
              value={exercise.id || ''}
            />
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Exercise Name</label>
              <select
                value={exercise.exercise_id}
                onChange={(e) => {
                  const updatedExercises = [...fitnessLogExercises];
                  updatedExercises[exerciseIndex].exercise_id = e.target.value;
                  setFitnessLogExercises(updatedExercises);
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm text-gray-500"
              >
                <option value="">Select Exercise</option>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
              <input
                type="hidden"
                name={`fitness_log_entry[fitness_log_exercises_attributes][${exerciseIndex}][exercise_id]`}
                value={exercise.exercise_id}
              />
            </div>

            {exercise.fitness_log_sets.map((set, setIndex) => (
              <div key={setIndex} className="flex gap-3 items-center">
                <input
                  type="hidden"
                  name={`fitness_log_entry[fitness_log_exercises_attributes][${exerciseIndex}][fitness_log_sets_attributes][${setIndex}][id]`}
                  value={set.id || ''}
                />
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Reps</label>
                  <input
                    type="text"
                    placeholder="..."
                    value={set.reps}
                    onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'reps')}
                    className="rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm text-gray-500 w-20"
                  />
                  <input
                    type="hidden"
                    name={`fitness_log_entry[fitness_log_exercises_attributes][${exerciseIndex}][fitness_log_sets_attributes][${setIndex}][reps]`}
                    value={set.reps}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Weight</label>
                  <div className="flex items-center border border-gray-300 rounded-md focus-within:border-sky-500 w-min focus-within:ring-sky-500 focus-within:ring-1">
                    <input
                      type="text"
                      placeholder="..."
                      value={set.weight}
                      onChange={(e) => handleChange(e, exerciseIndex, setIndex, 'weight')}
                      className="shadow-sm text-sm text-gray-500 focus:ring-0 focus:border-0 border-0 rounded-l-md w-20"
                    />
                    <div className="rounded-r-md text-sm bg-white w-full p-2 uppercase text-gray-500 border-l border-gray-300">
                      Kg
                    </div>
                  </div>
                  <input
                    type="hidden"
                    name={`fitness_log_entry[fitness_log_exercises_attributes][${exerciseIndex}][fitness_log_sets_attributes][${setIndex}][weight]`}
                    value={set.weight}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSet(exerciseIndex)}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 underline"
            >
              Add Set
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addExercise}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 underline"
      >
        Add Exercise
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}

export default LogForm;
