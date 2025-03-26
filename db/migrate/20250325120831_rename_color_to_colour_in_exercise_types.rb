class RenameColorToColourInExerciseTypes < ActiveRecord::Migration[7.1]
  def change
    rename_column :exercise_types, :color, :colour
  end
end
