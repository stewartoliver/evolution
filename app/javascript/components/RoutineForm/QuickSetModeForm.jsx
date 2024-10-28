// components/Forms/RoutineForm/QuickSetModeForm.js
import React from "react";
import PropTypes from "prop-types";
import InlineButton from "../Common/InlineButton";

const QuickSetModeForm = ({
  fields,
  handleQuickSetChange,
  generateSets,
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-4">
      {["sets", "reps", "weight"].map((field) => (
        <div key={field} className="flex flex-col">
          <label className="text-sm font-medium mb-2 capitalize">
            {field}
          </label>
          <input
            type="number"
            className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2"
            placeholder={
              field === "sets"
                ? "3"
                : field === "reps"
                ? "12"
                : "60"
            }
            name={field}
            value={fields[field] || ""}
            onChange={(e) => handleQuickSetChange(e, field)}
          />
        </div>
      ))}
    </div>
    <InlineButton
      type="button"
      onClick={generateSets}
    >
      Generate Sets
    </InlineButton>
  </div>
);

QuickSetModeForm.propTypes = {
  fields: PropTypes.shape({
    sets: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  handleQuickSetChange: PropTypes.func.isRequired,
  generateSets: PropTypes.func.isRequired,
};

export default QuickSetModeForm;
