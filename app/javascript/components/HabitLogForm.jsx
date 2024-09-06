import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HabitLogForm = ({ habitId, habitName }) => {
  console.log('HabitLogForm render - props:', { habitId, habitName });

  const [occurrences, setOccurrences] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('HabitLogForm mounted for habit ID:', habitId, 'Name:', habitName);
    if (habitId) {
      fetchTodayOccurrences();
    }
  }, [habitId, habitName]);

  const fetchTodayOccurrences = async () => {
    try {
      const response = await axios.get(`/objectives/habits/${habitId}/today_occurrences`);
      setOccurrences(response.data.occurrences);
    } catch (error) {
      console.error('Error fetching today\'s occurrences', error);
      setError('Failed to fetch today\'s progress.');
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
      await fetchTodayOccurrences();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrease = () => updateHabitLog(occurrences + 1);
  const handleDecrease = () => updateHabitLog(Math.max(occurrences - 1, 0));

  if (!habitId) {
    return <div>Error: No habit ID provided</div>;
  }

  return (
    <div className="max-w-xs">
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:border-sky-500 transition-all duration-300">
    <div className="text-lg font-semibold text-gray-800 border-b pb-2">
    {habitName ? habitName : 'Unnamed Habit'}
    </div>
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