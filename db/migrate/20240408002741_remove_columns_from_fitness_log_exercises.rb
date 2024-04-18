class RemoveColumnsFromFitnessLogExercises < ActiveRecord::Migration[7.1]
  def change
    remove_column :fitness_log_exercises, :sets, :integer
    remove_column :fitness_log_exercises, :reps, :integer
    remove_column :fitness_log_exercises, :weight, :integer
    remove_column :fitness_log_exercises, :duration, :integer
    remove_column :fitness_log_exercises, :distance, :integer
    remove_column :fitness_log_exercises, :intensity, :string
    remove_column :fitness_log_exercises, :speed, :decimal
    remove_column :fitness_log_exercises, :laps, :integer
    remove_column :fitness_log_exercises, :style, :string
    remove_column :fitness_log_exercises, :muscle_groups, :string
  end
end
