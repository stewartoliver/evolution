class CreateExpenses < ActiveRecord::Migration[7.1]
  def change
    create_table :expenses do |t|
      t.references :account, null: false, foreign_key: true
      t.decimal :amount, precision: 15, scale: 2
      t.string :category
      t.string :description
      t.datetime :date

      t.timestamps
    end
  end
end
