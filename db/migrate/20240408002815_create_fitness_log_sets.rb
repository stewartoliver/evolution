class CreateFitnessLogSets < ActiveRecord::Migration[7.1]
  def change
    create_table :fitness_log_sets do |t|
     t.references :log_exercise, null: false, foreign_key: { to_table: :fitness_log_exercises }
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
