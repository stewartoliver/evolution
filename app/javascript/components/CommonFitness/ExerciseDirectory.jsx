import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

console.log('ExerciseDirectory component module loaded');

const ExerciseDirectory = () => {
  console.log('ExerciseDirectory component rendering');
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedExerciseType, setSelectedExerciseType] = useState('');
  const [expandedExercise, setExpandedExercise] = useState(null);

  useEffect(() => {
    console.log('Fetching exercises...');
    const fetchExercises = async () => {
      try {
        const response = await fetch('/fitness/exercises.json', {
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          }
        });
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched exercises:', data);
        setExercises(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercises. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const uniqueMuscleGroups = [...new Set(exercises.map(ex => ex.muscle_group?.name))].filter(Boolean);
  const uniqueExerciseTypes = [...new Set(exercises.map(ex => ex.exercise_type?.name))].filter(Boolean);

  console.log('Unique muscle groups:', uniqueMuscleGroups);
  console.log('Unique exercise types:', uniqueExerciseTypes);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = !selectedMuscleGroup || exercise.muscle_group?.name === selectedMuscleGroup;
    const matchesExerciseType = !selectedExerciseType || exercise.exercise_type?.name === selectedExerciseType;
    return matchesSearch && matchesMuscleGroup && matchesExerciseType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading exercises...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {exercise.name}
              </h3>
              {expandedExercise === exercise.id ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            {expandedExercise === exercise.id && (
              <div className="px-4 pb-4">
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {exercise.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200">
                    {exercise.muscle_group?.name}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm dark:bg-green-900 dark:text-green-200">
                    {exercise.exercise_type?.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseDirectory; 