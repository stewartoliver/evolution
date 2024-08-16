class UpdatePrecisionInUsers < ActiveRecord::Migration[7.1]
  def change
    change_column :users, :bmi, :decimal, precision: 7, scale: 2
    change_column :users, :bmr, :decimal, precision: 7, scale: 2
    change_column :users, :daily_caloric_needs, :decimal, precision: 7, scale: 2
  end
end
