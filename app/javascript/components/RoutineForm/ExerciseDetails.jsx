// components/Forms/RoutineForm/ExerciseDetails.js
import React from "react";
import PropTypes from "prop-types";
import InlineButton from "../Common/InlineButton";
import InlineSwitch from "../Common/InlineSwitch";
import SetsTable from "./SetsTable";
import QuickSetModeForm from "./QuickSetModeForm";
import { Copy, Save, Plus } from "lucide-react";

const ExerciseDetails = ({
  exercise,
  index,
  toggleQuickSetMode,
  addSet,
  removeSet,
  handleSetChange,
  handleQuickSetChange,
  generateSets,
  addSetButtonText = "Add Set",
}) => (
  <div className="flex flex-col gap-4">
    {/* Quick Set Mode Toggle and Action Buttons */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Quick Set Mode</span>
        <InlineSwitch
          checked={exercise.quickSetMode}
          onCheckedChange={toggleQuickSetMode}
        />
      </div>
      <div className="flex gap-2">
        <InlineButton
          type="button"
          variant="outline"
          size="sm"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Last Routine
        </InlineButton>
        <InlineButton
          type="button"
          variant="outline"
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Template
        </InlineButton>
      </div>
    </div>

    {/* Quick Set Mode or Regular Sets */}
    {exercise.quickSetMode ? (
      <QuickSetModeForm
        fields={{
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
        }}
        handleQuickSetChange={handleQuickSetChange}
        generateSets={generateSets}
      />
    ) : (
      <div className="space-y-4">
        <SetsTable
          routineSets={exercise.routine_sets}
          exerciseIndex={index}
          handleSetChange={handleSetChange}
          removeSet={removeSet}
        />
        <InlineButton
          type="button"
          onClick={addSet}
        >
          <Plus className="w-4 h-4 mr-2" />
          {addSetButtonText}
        </InlineButton>
      </div>
    )}
  </div>
);

ExerciseDetails.propTypes = {
  exercise: PropTypes.shape({
    quickSetMode: PropTypes.bool.isRequired,
    sets: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    routine_sets: PropTypes.arrayOf(
      PropTypes.shape({
        reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        // Add other fields if necessary
      })
    ).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  toggleQuickSetMode: PropTypes.func.isRequired,
  addSet: PropTypes.func.isRequired,
  removeSet: PropTypes.func.isRequired,
  handleSetChange: PropTypes.func.isRequired,
  handleQuickSetChange: PropTypes.func.isRequired,
  generateSets: PropTypes.func.isRequired,
  addSetButtonText: PropTypes.string,
};

ExerciseDetails.defaultProps = {
  addSetButtonText: "Add Set",
};

export default ExerciseDetails;
