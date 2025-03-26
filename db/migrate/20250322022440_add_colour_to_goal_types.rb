class AddColourToGoalTypes < ActiveRecord::Migration[7.1]
  def change
    add_column :goal_types, :colour, :string
  end
end
