class AddFieldsToRoutineSets < ActiveRecord::Migration[7.1]
  def change
    add_column :routine_sets, :duration, :integer
    add_column :routine_sets, :distance, :integer
    add_column :routine_sets, :intensity, :string
    add_column :routine_sets, :speed, :decimal
    add_column :routine_sets, :laps, :integer
    add_column :routine_sets, :style, :string
  end
end
