class CreateAccounts < ActiveRecord::Migration[7.1]
  def change
    create_table :accounts do |t|
      t.string :account_name
      t.string :account_type
      t.decimal :balance, precision: 15, scale: 2
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
