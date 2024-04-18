class CreateRoutineExercises < ActiveRecord::Migration[7.1]
  def change
    create_table :routine_exercises do |t|
      t.references :routine, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true
      t.integer :order

      t.timestamps
    end
  end
end
