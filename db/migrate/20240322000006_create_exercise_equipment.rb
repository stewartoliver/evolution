class CreateExerciseEquipment < ActiveRecord::Migration[7.1]
  def change
    create_table :exercise_equipment do |t|
      t.references :exercise, null: false, foreign_key: true
      t.references :equipment, null: false, foreign_key: true
      
      t.timestamps
    end
    
    add_index :exercise_equipment, [:exercise_id, :equipment_id], unique: true
  end
end 