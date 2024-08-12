class CreateDietGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :diet_goals do |t|
      t.integer :calories
      t.datetime :date
      t.references :goal, polymorphic: true, null: false

      t.timestamps
    end
  end
end
