class AddCompletedAtAndGenerationToGoals < ActiveRecord::Migration[7.1]
  def change
    add_column :goals, :completed_at, :datetime
    add_column :goals, :generation, :integer, default: 0
  end
end
