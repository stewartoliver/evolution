class CreateRoutines < ActiveRecord::Migration[7.1]
  def change
    create_table :routines do |t|
      t.string :name
      t.text :description
      t.integer :user_id
      t.datetime :approved_at
      t.integer :approved_by_id

      t.timestamps
    end
  end
end
