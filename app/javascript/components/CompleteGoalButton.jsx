import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CompleteGoalButton = ({ goalId }) => {
  const [show, setShow] = useState(false);
  const [remainingTasks, setRemainingTasks] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetch(`/objectives/goals/${goalId}/remaining_tasks`)
      .then(response => response.json())
      .then(data => setRemainingTasks(data))
      .catch(error => console.error('Error:', error));
  }, [goalId]);

  const completeGoal = () => {
    fetch(`/objectives/goals/${goalId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setShow(false);
        window.location.reload(); // Reload the page to reflect changes
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to complete the goal. Please try again.');
      });
  };

  return (
    <>
      <button className="complete-btn" onClick={handleShow}>
        Complete
      </button>

      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded shadow-xl text-gray-700">
            <div className="text-xl font-bold mb-4 text-sky-900">Confirm Goal Completion</div>
            <div>The following tasks are not yet completed and will be auto-completed if you proceed:</div>
            <ul className="list-disc pl-5">
              {remainingTasks.map(task => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
            <div>Please confirm to acknowledge this.</div>
            <div className="flex justify-end gap-2">
              <button className="text-gray-700" onClick={handleClose}>
                Cancel
              </button>
              <button className="complete-btn" onClick={completeGoal}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CompleteGoalButton.propTypes = {
  goalId: PropTypes.number.isRequired,
};

export default CompleteGoalButton;
