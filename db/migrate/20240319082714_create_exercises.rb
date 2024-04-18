class CreateExercises < ActiveRecord::Migration[7.1]
  def change
    create_table :exercises do |t|
      t.string :name
      t.text :description
      t.string :muscle_group
      t.integer :added_by_id
      t.datetime :approved_at
      t.integer :approved_by_id
    end
  end
end
