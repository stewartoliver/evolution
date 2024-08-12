class ModifyDecimalPrecisionInUsers < ActiveRecord::Migration[7.1]
  def change
    change_column :users, :height, :decimal, precision: 7, scale: 2
    change_column :users, :current_weight, :decimal, precision: 7, scale: 2
    change_column :users, :goal_weight, :decimal, precision: 7, scale: 2
    change_column :users, :current_calorie_intake, :decimal, precision: 7, scale: 2
    change_column :users, :target_calorie_intake, :decimal, precision: 7, scale: 2
  end
end
