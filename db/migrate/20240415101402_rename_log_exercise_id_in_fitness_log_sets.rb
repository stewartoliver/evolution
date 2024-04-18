class RenameLogExerciseIdInFitnessLogSets < ActiveRecord::Migration[7.1]
  def change
    rename_column :fitness_log_sets, :log_exercise_id, :fitness_log_exercise_id
  end
end
