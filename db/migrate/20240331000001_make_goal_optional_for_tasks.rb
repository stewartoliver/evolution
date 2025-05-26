class MakeGoalOptionalForTasks < ActiveRecord::Migration[7.1]
  def change
    change_column_null :tasks, :goal_id, true
  end
end 