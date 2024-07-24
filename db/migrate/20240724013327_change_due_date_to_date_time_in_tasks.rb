class ChangeDueDateToDateTimeInTasks < ActiveRecord::Migration[7.1]
  def change
    change_column :tasks, :due_date, :datetime
  end
end
