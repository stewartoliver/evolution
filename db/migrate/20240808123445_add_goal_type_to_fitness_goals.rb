class AddGoalTypeToFitnessGoals < ActiveRecord::Migration[7.1]
  def change
    add_column :fitness_goals, :goal_type, :string
  end
end
