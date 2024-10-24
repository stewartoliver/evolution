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
    <div className="flex flex-col gap-4 relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for an exercise..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="rounded-md border bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark font-medium text-sm focus:ring-0 w-full lg:min-w-60 px-4 py-2"
      />

      {/* Search Results */}
      {searchQuery && (
        filteredExercises.length > 0 ? (
          <div className="absolute left-0 right-0 bg-background-input-light dark:bg-background-input-dark rounded-md shadow-lg mt-10 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden z-10">
            {filteredExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`px-4 py-2 cursor-pointer bg-background-input-light dark:bg-background-card-dark hover:bg-opacity-80 hover:dark:bg-opacity-80 text-text-light dark:text-text-dark first:rounded-t-md last:rounded-b-md`}
                onClick={() => handleExerciseClick(exercise)}
                aria-label={`Select ${exercise.name || 'Unnamed Exercise'}`}
              >
                {/* Exercise Name */}
                <div className="text-lg font-medium">
                  {exercise.name || 'Unnamed Exercise'}
                </div>

                {/* Exercise Details */}
                <div className="flex flex-col gap-2 text-sm mt-1">
                  <div>
                    <span className="font-semibold">Muscle:</span> {exercise.muscle_group?.name || 'Unknown Muscle Group'}
                  </div>
                  <div>
                    <span className="font-semibold">Type:</span> {exercise.exercise_type?.name || 'Unknown Type'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No Results Found
          <div className="absolute left-0 right-0 bg-background-input-light dark:bg-background-input-dark rounded-md shadow-lg mt-1 p-4 text-text-light dark:text-text-dark">
            No exercises found.
          </div>
        )
      )}
    </div>
  );
}

export default ExerciseSearch;
