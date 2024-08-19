class UpdateIndexesForFinancialStoreIdInTransactions < ActiveRecord::Migration[7.1]
  def change
    remove_index :transactions, :store_id if index_exists?(:transactions, :store_id)

    unless index_exists?(:transactions, :financial_store_id)
      add_index :transactions, :financial_store_id
    end
  end
end
