import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const ExerciseDirectory = () => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedExerciseType, setSelectedExerciseType] = useState('');
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/fitness/exercises.json', {
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = !selectedMuscleGroup || exercise.muscle_group?.name === selectedMuscleGroup;
    const matchesExerciseType = !selectedExerciseType || exercise.exercise_type?.name === selectedExerciseType;
    return matchesSearch && matchesMuscleGroup && matchesExerciseType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);
  const currentItems = filteredExercises.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key) => {
    if (sortField === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(key);
      setSortDirection('asc');
    }

    const sortedExercises = [...exercises].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      
      // Handle nested properties for exercise_type and muscle_group
      if (key === 'exercise_type' || key === 'muscle_group') {
        valA = a[key]?.name || '';
        valB = b[key]?.name || '';
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setExercises(sortedExercises);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 text-text-light dark:text-text-dark">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 text-text-light dark:text-text-dark">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 text-text-light dark:text-text-dark">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
      </svg>
    );
  };

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
    <div className="w-full space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-background-card dark:bg-background-card-dark rounded-md">
        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={selectedExerciseType}
            onChange={(e) => setSelectedExerciseType(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-md border border-gray-300 whitespace-nowrap dark:border-gray-600 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {uniqueExerciseTypes.map(exercise_type => (
              <option key={exercise_type} value={exercise_type}>
                {exercise_type}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-md border border-gray-300 whitespace-nowrap dark:border-gray-600 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Muscles</option>
            {uniqueMuscleGroups.map(muscle_group => (
              <option key={muscle_group} value={muscle_group}>
                {muscle_group}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Exercise Results */}
      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-background-card dark:bg-background-card-dark">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <span>{getSortIcon('name')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('exercise_type')}
                className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <span>{getSortIcon('exercise_type')}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort('muscle_group')}
                className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Muscle Group</span>
                  <span>{getSortIcon('muscle_group')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-background-light dark:bg-background-dark divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.length > 0 ? (
              currentItems.map((exercise) => (
                <tr key={exercise.id} className="hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors">
                  <td className="px-4 py-4 text-sm text-text-light dark:text-text-dark">{exercise.name}</td>
                  <td className="px-4 py-4 text-sm text-text-light dark:text-text-dark">{exercise.exercise_type?.name || 'N/A'}</td>
                  <td className="px-4 py-4 text-sm text-text-light dark:text-text-dark">{exercise.muscle_group?.name || 'N/A'}</td>
                  <td className="px-4 py-4 text-sm">
                    <a href={`../fitness/exercises/${exercise.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No exercises found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredExercises.length > 0 && (
        <div className="flex justify-between items-center px-4 py-3 bg-background-card dark:bg-background-card-dark rounded-md">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredExercises.length)}</span> of{' '}
            <span className="font-medium">{filteredExercises.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-background-hover dark:hover:bg-background-hover-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-background-hover dark:hover:bg-background-hover-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDirectory;