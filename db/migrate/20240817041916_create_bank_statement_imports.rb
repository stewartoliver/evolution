class CreateBankStatementImports < ActiveRecord::Migration[7.1]
  def change
    create_table :bank_statement_imports do |t|
      t.string :transaction_type
      t.string :details
      t.string :particulars
      t.string :code
      t.string :reference
      t.decimal :amount, precision: 15, scale: 2
      t.date :transaction_date
      t.decimal :foreign_currency_amount, precision: 15, scale: 2
      t.decimal :conversion_charge, precision: 15, scale: 2
      t.bigint :user_id, null: false

      t.timestamps
    end

    add_index :bank_statement_imports, :user_id
  end
end
