class RenameStoreIdToFinancialStoreIdInTransactions < ActiveRecord::Migration[7.1]
  def change
    rename_column :transactions, :store_id, :financial_store_id
  end
end
