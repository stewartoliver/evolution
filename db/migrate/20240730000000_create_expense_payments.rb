class CreateExpensePayments < ActiveRecord::Migration[7.1]
  def change
    create_table :expense_payments do |t|
      t.references :expense, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false
      t.boolean :verified, default: false
      t.datetime :verified_at
      t.references :transaction, foreign_key: true

      t.timestamps
    end

    add_index :expense_payments, [:expense_id, :date], unique: true
  end
end 