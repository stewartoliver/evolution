class CreateMuscleGroups < ActiveRecord::Migration[7.1]
  def change
    create_table :muscle_groups do |t|
      t.string :name, null: false
      t.text :description
      t.string :image_url
      
      t.timestamps
    end
    
    add_index :muscle_groups, :name, unique: true
  end
end 