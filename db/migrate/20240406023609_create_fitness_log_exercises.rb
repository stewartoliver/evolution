class CreateFitnessLogExercises < ActiveRecord::Migration[7.1]
  def change
    create_table :fitness_log_exercises do |t|
      t.references :log_entry, null: false, foreign_key: { to_table: :fitness_log_entries }
      t.references :exercise, null: false, foreign_key: true
      t.integer :sets
      t.integer :reps
      t.integer :weight
      t.integer :duration
      t.integer :distance
      t.string :intensity
      t.decimal :speed
      t.integer :laps
      t.string :style
      t.string :muscle_groups
      t.timestamps
    end
  end
end
