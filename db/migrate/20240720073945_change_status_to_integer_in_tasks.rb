class ChangeStatusToIntegerInTasks < ActiveRecord::Migration[7.1]
  def change
    remove_column :tasks, :status, :string
    add_column :tasks, :status, :integer, default: 0, null: false
  end
end