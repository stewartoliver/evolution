class AddColorToGoalTypes < ActiveRecord::Migration[7.1]
  def change
    add_column :goal_types, :color, :string
  end
end
