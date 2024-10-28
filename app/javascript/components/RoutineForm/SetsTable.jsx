// components/Forms/RoutineForm/SetsTable.js
import React from "react";
import PropTypes from "prop-types";
import SetRow from "./SetRow";

const SetsTable = ({
  routineSets,
  exerciseIndex,
  exerciseTypeId,
  handleSetChange,
  removeSet,
}) => {
  const getFieldsForExerciseType = (typeId) => {
    switch (parseInt(typeId, 10)) {
      case 1: // Cardio
        return ["duration", "distance", "intensity"];
      case 2: // Strength Training
        return ["reps", "weight"];
      case 3: // Flexibility
        return ["duration", "style", "intensity"];
      default:
        return [];
    }
  };

  const fields = getFieldsForExerciseType(exerciseTypeId);

  return (
    <div className="bg-background-input-light dark:bg-background-input-dark rounded-lg p-4">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-sm font-medium">
            <th className="px-2 py-1 text-left">Set</th>
            {fields.map((field) => (
              <th key={field} className="px-2 py-1 text-left capitalize">
                {field.replace('_', ' ')}
              </th>
            ))}
            <th className="px-2 py-1 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routineSets.map((set, setIndex) => (
            <SetRow
              key={`${exerciseIndex}-${setIndex}`}
              setIndex={setIndex}
              setData={set}
              exerciseIndex={exerciseIndex}
              fields={fields}
              handleSetChange={handleSetChange}
              removeSet={removeSet}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

SetsTable.propTypes = {
  routineSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  exerciseIndex: PropTypes.number.isRequired,
  exerciseTypeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  handleSetChange: PropTypes.func.isRequired,
  removeSet: PropTypes.func.isRequired,
};

export default SetsTable;
