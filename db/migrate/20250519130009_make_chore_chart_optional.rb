class MakeChoreChartOptional < ActiveRecord::Migration[7.1]
  def change
    change_column_null :chores, :chore_chart_id, true
  end
end
