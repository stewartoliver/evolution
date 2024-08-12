class CreateWeightGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :weight_goals do |t|
      t.decimal :target_weight
      t.decimal :current_weight
      t.datetime :date
      t.references :goal, polymorphic: true, null: false

      t.timestamps
    end
  end
end
