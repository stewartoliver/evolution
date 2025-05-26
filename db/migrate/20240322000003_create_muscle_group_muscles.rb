class CreateMuscleGroupMuscles < ActiveRecord::Migration[7.1]
  def change
    create_table :muscle_group_muscles do |t|
      t.references :muscle_group, null: false
      t.references :muscle, null: false
      t.integer :primary_order
      
      t.timestamps
    end
    
    add_index :muscle_group_muscles, [:muscle_group_id, :muscle_id], unique: true
  end
end 