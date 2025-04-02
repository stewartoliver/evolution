// components/Forms/RoutineForm/ExerciseItem.jsx
import React from "react";
import PropTypes from "prop-types";
import InlineButton from "../Common/InlineButton";
import InlineSwitch from "../Common/InlineSwitch";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Save,
  Plus,
} from "lucide-react";
import ExerciseSearch from "../CommonFitness/ExerciseSearch";
import SetsTable from "./SetsTable";

const ExerciseItem = ({
  exercise,
  index,
  getExerciseTypeIcon,
  handleExerciseSelect,
  handleExerciseSearchToggle,
  toggleCollapse,
  toggleQuickSetMode,
  addSet,
  removeSet,
  handleSetChange,
  handleQuickSetChange,
  generateSets,
}) => {
  // Function to get the fields for Quick Set Mode and SetsTable based on exercise type
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

  const quickSetFields = getFieldsForExerciseType(exercise.exercise_type_id);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-col gap-4 p-2 bg-background-card-light dark:bg-background-card-dark rounded-lg shadow-sm">
        {/* Exercise Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500">
              {getExerciseTypeIcon(exercise.exercise_type_id)}
            </div>
            <div>
              <span className="text-lg font-medium">Exercise #{index + 1}</span>
              {exercise.isSelected && exercise.exercise_name && (
                <span className="block text-sm">{exercise.exercise_name}</span>
              )}
            </div>
          </div>
          {/* Exercise Controls */}
          <div className="flex gap-2">
            {exercise.showExerciseSearch ? (
              <>
                <ExerciseSearch
                  onSelectExercise={(ex) => handleExerciseSelect(ex, index)}
                />
                <InlineButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleExerciseSearchToggle(index, false)}
                >
                  Cancel
                </InlineButton>
              </>
            ) : (
              exercise.isSelected && (
                <>
                  <InlineButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleExerciseSearchToggle(index, true)}
                  >
                    Change Exercise
                  </InlineButton>
                  <InlineButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCollapse(index)}
                  >
                    {exercise.collapsed ? (
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
              )
            )}
          </div>
        </div>

        {/* Hidden inputs for exercise_id and id */}
        {exercise.isSelected && (
          <>
            <input
              type="hidden"
              name={`routine[routine_exercises_attributes][${index}][exercise_id]`}
              value={exercise.exercise_id}
            />
            {exercise.id && (
              <input
                type="hidden"
                name={`routine[routine_exercises_attributes][${index}][id]`}
                value={exercise.id}
              />
            )}
          </>
        )}

        {/* Exercise Details */}
        {exercise.isSelected && !exercise.collapsed && (
          <div className="flex flex-col gap-4">
            {/* Quick Set Mode Toggle and Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Quick Set Mode</span>
                <InlineSwitch
                  checked={exercise.quickSetMode}
                  onCheckedChange={() => toggleQuickSetMode(index)}
                />
              </div>
              <div className="flex gap-2">
                <InlineButton type="button" variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Last Workout
                </InlineButton>
                <InlineButton type="button" variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save as Template
                </InlineButton>
              </div>
            </div>

            {/* Quick Set Mode or Regular Sets */}
            {exercise.quickSetMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* Number of Sets Input */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-2">Sets</label>
                    <input
                      type="number"
                      name={`routine[routine_exercises_attributes][${index}][sets]`}
                      className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2"
                      placeholder="3"
                      value={exercise.sets || ""}
                      onChange={(e) => handleQuickSetChange(e, index, "sets")}
                    />
                  </div>
                  {/* Other Fields Based on Exercise Type */}
                  {quickSetFields.map((field) => (
                    <div key={field} className="flex flex-col">
                      <label className="text-sm font-medium mb-2 capitalize">
                        {field.replace('_', ' ')}
                      </label>
                      <input
                        type={
                          field === "style" || field === "intensity"
                            ? "text"
                            : "number"
                        }
                        name={`routine[routine_exercises_attributes][${index}][${field}]`}
                        className="rounded-md border bg-background-input-light dark:bg-background-input-dark p-2"
                        placeholder={field}
                        value={exercise[field] || ""}
                        onChange={(e) => handleQuickSetChange(e, index, field)}
                      />
                    </div>
                  ))}
                </div>
                <InlineButton type="button" onClick={() => generateSets(index)}>
                  Generate Sets
                </InlineButton>
              </div>
            ) : (
              <div className="space-y-4">
                <SetsTable
                  routineSets={exercise.routine_sets}
                  exerciseIndex={index}
                  exerciseTypeId={exercise.exercise_type_id}
                  handleSetChange={handleSetChange}
                  removeSet={removeSet}
                />
                <InlineButton type="button" onClick={() => addSet(index)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Set
                </InlineButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ExerciseItem.propTypes = {
  exercise: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  getExerciseTypeIcon: PropTypes.func.isRequired,
  handleExerciseSelect: PropTypes.func.isRequired,
  handleExerciseSearchToggle: PropTypes.func.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
  toggleQuickSetMode: PropTypes.func.isRequired,
  addSet: PropTypes.func.isRequired,
  removeSet: PropTypes.func.isRequired,
  handleSetChange: PropTypes.func.isRequired,
  handleQuickSetChange: PropTypes.func.isRequired,
  generateSets: PropTypes.func.isRequired,
};

export default ExerciseItem;
