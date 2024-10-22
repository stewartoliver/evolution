import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HabitLogForm = ({ habitId }) => {
  console.log('HabitLogForm render - habitId:', habitId);
  const [habitDetails, setHabitDetails] = useState(null);
  const [occurrences, setOccurrences] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('HabitLogForm useEffect - habitId:', habitId);
    if (habitId) {
      fetchHabitDetails();
    }
  }, [habitId]);

  const fetchHabitDetails = async () => {
    try {
      console.log('Fetching habit details for ID:', habitId);
      const response = await axios.get(`/objectives/habits/${habitId}/details`);
      console.log('Habit details received:', response.data);
      setHabitDetails(response.data);
      setOccurrences(response.data.occurrences);
    } catch (error) {
      console.error('Error fetching habit details', error);
      setError('Failed to fetch habit details.');
    }
  };

  const updateHabitLog = async (newOccurrences) => {
    setIsUpdating(true);
    setError(null);
    try {
      await axios.post(`/objectives/habits/${habitId}/habit_logs`, {
        habit_log: { occurrences: newOccurrences }
      }, {
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      });
      setOccurrences(newOccurrences);
    } catch (error) {
      console.error('Error updating habit log', error);
      setError('Failed to update habit. Please try again.');
      await fetchHabitDetails();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrease = () => updateHabitLog(occurrences + 1);
  const handleDecrease = () => updateHabitLog(Math.max(occurrences - 1, 0));

  if (!habitId) {
    console.log('No habit ID provided');
    return <div>Error: No habit ID provided</div>;
  }

  if (!habitDetails) {
    console.log('Habit details not loaded yet');
    return <div>Loading habit details...</div>;
  }

  console.log('Rendering habit form with occurrences:', occurrences);

  return (
    <div className="max-w-xs">
      <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:border-sky-500 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-700">{occurrences}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={isUpdating || occurrences <= 0}
              className="rounded-full w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-600 font-medium hover:bg-sky-200 transition-colors duration-300 disabled:opacity-50"
            >
              -
            </button>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={isUpdating}
              className="rounded-full w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-600 font-medium hover:bg-sky-200 transition-colors duration-300 disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {isUpdating && <p className="text-sky-500 mt-2 text-sm">Updating...</p>}
    </div>
  );
};

export default HabitLogForm;