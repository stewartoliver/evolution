# db/migrate/202408080018_update_fitness_goals.rb
class UpdateFitnessGoals < ActiveRecord::Migration[7.1]
  def change
    change_table :fitness_goals do |t|
      t.remove :exercise
      t.integer :exercise_id
      t.string :intensity
      t.string :frequency
      t.integer :sets
      t.integer :reps
      t.decimal :distance, precision: 10, scale: 2
      t.integer :calories_burned
    end
  end
end
