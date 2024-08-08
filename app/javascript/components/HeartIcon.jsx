import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const HeartIcon = ({ goalId, initialFavourite }) => {
  const [isFavourite, setIsFavourite] = useState(initialFavourite);

  const toggleFavourite = () => {
    setIsFavourite(!isFavourite);
    fetch(`/objectives/goals/${goalId}/toggle_favourite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ is_favourite: !isFavourite }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Optionally handle the response data
      })
      .catch(error => {
        console.error('Error:', error);
        // Revert the state change in case of an error
        setIsFavourite(initialFavourite);
      });
  };

  useEffect(() => {
    setIsFavourite(initialFavourite);
  }, [initialFavourite]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      className={`w-6 h-6 ${isFavourite ? 'stroke-red-400 fill-red-500 hover:fill-red-400' : 'stroke-black fill-none hover:fill-red-200'}`}
      onClick={toggleFavourite}
      style={{ cursor: 'pointer' }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
};

HeartIcon.propTypes = {
  goalId: PropTypes.number.isRequired,
  initialFavourite: PropTypes.bool.isRequired,
};

export default HeartIcon;
