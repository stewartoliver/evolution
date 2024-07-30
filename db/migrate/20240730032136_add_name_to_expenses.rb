class AddNameToExpenses < ActiveRecord::Migration[7.1]
  def change
    add_column :expenses, :name, :string
  end
end
