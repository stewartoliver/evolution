class CreateFinancialTransactionTaggings < ActiveRecord::Migration[7.1]
  def change
    create_table :financial_transaction_taggings do |t|
      t.bigint :financial_transaction_id, null: false
      t.bigint :financial_tag_id, null: false

      t.timestamps
    end

    add_index :financial_transaction_taggings, :financial_transaction_id, name: "index_financial_transaction_taggings_on_transaction_id"
    add_index :financial_transaction_taggings, :financial_tag_id, name: "index_financial_transaction_taggings_on_tag_id"
  end
end
