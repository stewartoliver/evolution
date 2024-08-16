class AddCalculatedFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :daily_caloric_needs, :decimal, precision: 7, scale: 2
  end
end
