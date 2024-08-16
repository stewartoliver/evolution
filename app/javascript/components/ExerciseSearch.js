import React, { useState, useEffect } from 'react';

function ExerciseSearch({ onSelectExercise }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);

  useEffect(() => {
  // Fetch exercises from the backend, explicitly requesting JSON
  fetch('/fitness/exercises', {
    headers: {
      'Accept': 'application/json' // Ensure the server responds with JSON
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Fetched exercises:', data); // Log the fetched exercises
      setExercises(data);
      setFilteredExercises(data); // Initially show all exercises
    })
    .catch((error) => console.error('Error fetching exercises:', error));
}, []);

  useEffect(() => {
    // Filter exercises based on the search query
    const filtered = exercises.filter((exercise) =>
      exercise.name && exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('Filtered exercises:', filtered); // Log the filtered exercises
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExerciseClick = (exercise) => {
    // Trigger the onSelectExercise callback when an exercise is clicked
    console.log('Selected exercise:', exercise); // Log the selected exercise
    if (onSelectExercise) {
      onSelectExercise(exercise);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Search for an exercise..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="px-3 py-2 bg-gray-100 rounded-md w-full focus:ring-0 border-0 placeholder-gray-500 text-gray-500"
      />
      <div className="bg-sky-700">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="px-3 py-1 cursor-pointer text-gray-200 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => handleExerciseClick(exercise)}
            >
              <div className="text-lg font-medium">
                {exercise.name || 'Unnamed Exercise'}
              </div>
              <div className="text-sm">
                Type: {exercise.exercise_type?.name || 'Unknown Type'} | Muscle Group: {exercise.muscle_group?.name || 'Unknown Muscle Group'}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results p-2 text-gray-500">No exercises found.</div>
        )}
      </div>
    </div>
  );
}

export default ExerciseSearch;
