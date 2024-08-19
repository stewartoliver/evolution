class AddFieldsToTransactions < ActiveRecord::Migration[7.1]
  def change
    add_column :transactions, :store_name, :string
    add_column :transactions, :store_id, :bigint
    add_column :transactions, :bank_statement_import_id, :bigint

    add_index :transactions, :store_id
    add_index :transactions, :bank_statement_import_id
  end
end
