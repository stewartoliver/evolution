class CreateFinanceGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :finance_goals do |t|
      t.decimal :amount
      t.datetime :date
      t.integer :bank_account_id
      t.references :goal, polymorphic: true, null: false

      t.timestamps
    end
  end
end
