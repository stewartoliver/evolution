import React from 'react';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-background-card-light dark:bg-background-card-dark rounded-lg shadow-xl p-4 relative w-full max-w-7xl">
      <div className="flex justify-end w-full">
        <button
          className="text-light dark:text-dark hover:text-red-500"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
