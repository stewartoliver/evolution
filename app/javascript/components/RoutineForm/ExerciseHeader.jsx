// components/Forms/RoutineForm/ExerciseHeader.js
import React from "react";
import PropTypes from "prop-types";

const ExerciseHeader = ({ index, exerciseName, typeIcon }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-primary-500">
      {typeIcon}
    </div>
    <div>
      <span className="text-lg font-medium">
        Exercise #{index + 1}
      </span>
      {exerciseName && (
        <span className="block text-sm">
          {exerciseName}
        </span>
      )}
    </div>
  </div>
);

ExerciseHeader.propTypes = {
  index: PropTypes.number.isRequired,
  exerciseName: PropTypes.string,
  typeIcon: PropTypes.element.isRequired,
};

export default ExerciseHeader;
