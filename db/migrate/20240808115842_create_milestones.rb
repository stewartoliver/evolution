class CreateMilestones < ActiveRecord::Migration[7.1]
  def change
    create_table :milestones do |t|
      t.string :name
      t.text :description
      t.integer :target_value
      t.integer :achieved_value
      t.references :goal, null: false, foreign_key: true

      t.timestamps
    end
  end
end
