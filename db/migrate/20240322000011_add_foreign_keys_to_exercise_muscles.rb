class AddForeignKeysToExerciseMuscles < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :exercise_muscles, :exercises
    add_foreign_key :exercise_muscles, :muscles
  end
end 