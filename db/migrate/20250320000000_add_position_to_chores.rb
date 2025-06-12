class AddPositionToChores < ActiveRecord::Migration[7.1]
  def change
    add_column :chores, :position, :integer
    add_index :chores, :position
  end
end 