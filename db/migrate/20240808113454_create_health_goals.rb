class CreateHealthGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :health_goals do |t|
      t.text :description
      t.datetime :date
      t.references :goal, polymorphic: true, null: false

      t.timestamps
    end
  end
end
