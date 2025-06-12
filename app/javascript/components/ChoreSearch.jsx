import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';

const ChoreSearch = ({ onSelectChore }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Fetch chores based on search query
  const { data: chores, isLoading } = useQuery({
    queryKey: ['chores', 'search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await fetch(`/objectives/chores/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // Ensure distinct results by using a Map with chore IDs as keys
      const distinctChores = Array.from(
        new Map(data.map(chore => [chore.id, chore])).values()
      );
      return distinctChores;
    },
    enabled: query.trim().length > 0
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (chore) => {
    onSelectChore(chore);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for chores to add..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute z-10 mt-1 w-full bg-background-card dark:bg-background-card-dark rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="max-h-60 overflow-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Searching...
              </div>
            ) : chores && chores.length > 0 ? (
              <ul className="py-1">
                {chores.map((chore) => (
                  <li
                    key={chore.id}
                    onClick={() => handleSelect(chore)}
                    className="px-4 py-2 hover:bg-background-hover dark:hover:bg-background-hover-dark cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-text-light dark:text-text-dark">
                          {chore.name}
                        </div>
                        <div className="text-xs text-text-sub dark:text-text-sub-dark">
                          {chore.description || 'No description'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                          {chore.category || 'Uncategorized'}
                        </span>
                        {chore.estimated_minutes && (
                          <span className="text-xs text-text-sub dark:text-text-sub-dark">
                            {chore.estimated_minutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No chores found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoreSearch; 