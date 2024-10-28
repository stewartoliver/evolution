// components/Forms/RoutineForm/ExerciseControls.js
import React from "react";
import PropTypes from "prop-types";
import InlineButton from "../Common/InlineButton";
import ExerciseSearch from "../CommonFitness/ExerciseSearch";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExerciseControls = ({
  showExerciseSearch,
  onSelectExercise,
  onCancel,
  onChangeExercise,
  onToggleCollapse,
  isCollapsed,
}) => (
  <div className="flex gap-2">
    {showExerciseSearch ? (
      <>
        <ExerciseSearch onSelectExercise={onSelectExercise} />
        <InlineButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </InlineButton>
      </>
    ) : (
      <>
        <InlineButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onChangeExercise}
        >
          Change Exercise
        </InlineButton>
        <InlineButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Expand Sets
            </>
          ) : (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Collapse Sets
            </>
          )}
        </InlineButton>
      </>
    )}
  </div>
);

ExerciseControls.propTypes = {
  showExerciseSearch: PropTypes.bool.isRequired,
  onSelectExercise: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChangeExercise: PropTypes.func.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
};

export default ExerciseControls;
