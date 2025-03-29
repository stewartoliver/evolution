class AddMissingFieldsToTransactions < ActiveRecord::Migration[7.1]
  def change
    add_column :transactions, :details, :string
    add_column :transactions, :particulars, :string
    add_column :transactions, :code, :string
    add_column :transactions, :reference, :string
  end
end
