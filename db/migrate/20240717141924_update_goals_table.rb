class UpdateGoalsTable < ActiveRecord::Migration[7.1]
  def change
    remove_column :goals, :priority, :integer
    remove_column :goals, :tags, :string, array: true, default: []
    remove_column :goals, :reminder_frequency, :string
    remove_column :goals, :notes, :text

    add_column :goals, :is_favorite, :boolean, default: false
    add_column :goals, :status, :string, default: 'not started'
    change_column :goals, :progress, :integer, default: 0, null: false
    add_reference :goals, :parent_goal, foreign_key: { to_table: :goals }
  end
end
