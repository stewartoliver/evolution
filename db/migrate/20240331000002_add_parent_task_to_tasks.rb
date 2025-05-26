class AddParentTaskToTasks < ActiveRecord::Migration[7.1]
  def change
    add_reference :tasks, :parent_task, foreign_key: { to_table: :tasks }
    add_column :tasks, :position, :integer
    add_index :tasks, [:parent_task_id, :position]
  end
end 