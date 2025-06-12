class CreateChoreRotations < ActiveRecord::Migration[7.1]
  def change
    create_table :chore_rotations do |t|
      t.references :chore_chart, null: false, foreign_key: true
      t.references :chore, null: false, foreign_key: true
      t.integer :rotation_number
      t.date :start_date
      t.date :end_date
      t.boolean :completed, default: false

      t.timestamps
    end

    add_index :chore_rotations, [:chore_chart_id, :rotation_number]
  end
end 