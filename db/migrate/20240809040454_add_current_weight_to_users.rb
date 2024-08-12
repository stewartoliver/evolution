class AddCurrentWeightToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :current_weight, :decimal, precision: 5, scale: 2
  end
end
