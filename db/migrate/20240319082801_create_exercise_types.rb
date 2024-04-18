class CreateExerciseTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :exercise_types do |t|
      t.string :name
      t.string :color
      t.string :icon
      t.text :description
    end
  end
end
