// components/Forms/RoutineForm/SetRow.js
import React from "react";
import PropTypes from "prop-types";
import { Trash2 } from "lucide-react";

const SetRow = ({
  setIndex,
  setData,
  exerciseIndex,
  fields,
  handleSetChange,
  removeSet,
}) => (
  <tr className="text-text-light dark:text-text-dark">
    {/* Hidden inputs for set id */}
    {setData.id && (
      <input
        type="hidden"
        name={`routine[routine_exercises_attributes][${exerciseIndex}][routine_sets_attributes][${setIndex}][id]`}
        value={setData.id}
      />
    )}
    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
      {setIndex + 1}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
      {setData.reps && setData.weight
        ? `${setData.reps} × ${setData.weight}kg`
        : "—"}
    </td>
    {fields.map((field) => (
      <td key={field} className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
        <input
          type={field === "duration" || field === "distance" ? "number" : "text"}
          name={`routine[routine_exercises_attributes][${exerciseIndex}][routine_sets_attributes][${setIndex}][${field}]`}
          placeholder="0"
          value={setData[field] || ""}
          onChange={(e) => handleSetChange(e, exerciseIndex, setIndex, field)}
          className="rounded-md border-0 bg-background-card-light dark:bg-background-card-dark w-full"
        />
      </td>
    ))}
    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
      <button
        type="button"
        onClick={() => removeSet(exerciseIndex, setIndex)}
        className="text-red-500 hover:text-red-600 p-1 rounded-md transition"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </td>
  </tr>
);

SetRow.propTypes = {
  setIndex: PropTypes.number.isRequired,
  setData: PropTypes.object.isRequired,
  exerciseIndex: PropTypes.number.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSetChange: PropTypes.func.isRequired,
  removeSet: PropTypes.func.isRequired,
};

export default SetRow;
