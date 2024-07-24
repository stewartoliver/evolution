class AddOptionalFieldsToTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :priority, :integer
    add_column :tasks, :completed_at, :datetime
    add_column :tasks, :assigned_to, :integer
    add_column :tasks, :estimated_time, :decimal
    add_column :tasks, :actual_time, :decimal
    add_column :tasks, :tags, :string
    add_column :tasks, :is_recurring, :boolean
    add_column :tasks, :recurrence_interval, :string
  end
end
