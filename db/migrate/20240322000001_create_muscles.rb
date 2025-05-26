class CreateMuscles < ActiveRecord::Migration[7.1]
  def change
    create_table :muscles do |t|
      t.string :name, null: false
      t.string :scientific_name
      t.text :description
      t.string :image_url
      
      t.timestamps
    end
    
    add_index :muscles, :name, unique: true
  end
end 