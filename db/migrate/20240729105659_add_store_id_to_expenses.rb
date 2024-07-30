class AddStoreIdToExpenses < ActiveRecord::Migration[7.1]
  def change
    add_reference :expenses, :store, foreign_key: true
  end
end
