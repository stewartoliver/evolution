class RenameLogEntryIdInFitnessLogExercises < ActiveRecord::Migration[7.1]
  def change
    rename_column :fitness_log_exercises, :log_entry_id, :fitness_log_entry_id
  end
end
