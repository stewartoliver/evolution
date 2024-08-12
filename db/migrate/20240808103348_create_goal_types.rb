class CreateGoalTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :goal_types do |t|
      t.string :name, null: false
      t.text :description

      t.timestamps
    end
    add_reference :goals, :goal_type, foreign_key: true
  end
end
