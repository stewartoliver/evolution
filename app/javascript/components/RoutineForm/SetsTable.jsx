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
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-background-card dark:bg-background-card-dark">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
              Set
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
              Previous
            </th>
            {fields.map((field) => (
              <th key={field} className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider capitalize">
                {field.replace('_', ' ')}
              </th>
            ))}
            <th className="px-4 py-3 text-center text-xs font-medium whitespace-nowrap text-text-light dark:text-text-dark uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-background-light dark:bg-background-dark divide-y divide-gray-200 dark:divide-gray-700">
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
