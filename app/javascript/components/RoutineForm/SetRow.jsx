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
  <tr className="border-t">
    {/* Hidden inputs for set id */}
    {setData.id && (
      <input
        type="hidden"
        name={`routine[routine_exercises_attributes][${exerciseIndex}][routine_sets_attributes][${setIndex}][id]`}
        value={setData.id}
      />
    )}
    <td className="px-2 py-1 font-medium">{setIndex + 1}</td>
    {fields.map((field) => (
      <td key={field} className="px-2 py-1">
        <input
          type={field === "duration" || field === "distance" ? "number" : "text"}
          name={`routine[routine_exercises_attributes][${exerciseIndex}][routine_sets_attributes][${setIndex}][${field}]`}
          placeholder={field}
          value={setData[field] || ""}
          onChange={(e) => handleSetChange(e, exerciseIndex, setIndex, field)}
          className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2 w-full"
        />
      </td>
    ))}
    <td className="px-2 py-1">
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
