class CreateExerciseMuscles < ActiveRecord::Migration[7.1]
  def change
    create_table :exercise_muscles do |t|
      t.references :exercise, null: false
      t.references :muscle, null: false
      t.string :muscle_type, null: false
      t.integer :importance_order
      
      t.timestamps
    end
    
    add_index :exercise_muscles, [:exercise_id, :muscle_id, :muscle_type], unique: true, name: 'index_exercise_muscles_unique'
  end
end 