import React, { useEffect, useRef } from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'confirm', // 'confirm' or 'delete'
  anchorRef
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && anchorRef) {
      const rect = anchorRef.getBoundingClientRect();
      const modal = modalRef.current;
      if (modal) {
        // Position the modal directly below the anchor element
        const top = rect.bottom + window.scrollY + 4; // 4px gap
        const left = rect.left + window.scrollX;
        
        // Ensure the modal stays within viewport
        const modalWidth = modal.offsetWidth;
        const viewportWidth = window.innerWidth;
        
        // If modal would go off screen to the right, align it to the right edge of the anchor
        const finalLeft = left + modalWidth > viewportWidth ? 
          rect.right + window.scrollX - modalWidth : 
          left;

        modal.style.position = 'fixed';
        modal.style.top = `${top}px`;
        modal.style.left = `${finalLeft}px`;
        modal.style.zIndex = '9999';
      }
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          anchorRef && !anchorRef.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed z-[9999] bg-background-card-light dark:bg-background-card-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark p-2"
    >
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm font-medium rounded-md bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark hover:bg-background-input-hover-light dark:hover:bg-background-input-hover-dark transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`px-3 py-1 text-sm font-medium rounded-md text-white transition-colors ${
            type === 'delete'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal; 