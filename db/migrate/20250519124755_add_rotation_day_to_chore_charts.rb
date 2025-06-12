class AddRotationDayToChoreCharts < ActiveRecord::Migration[7.1]
  def change
    add_column :chore_charts, :rotation_day, :string
  end
end 