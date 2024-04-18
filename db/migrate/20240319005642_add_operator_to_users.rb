class AddOperatorToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :operator, :boolean, default: false
  end
end
