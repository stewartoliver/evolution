class CreateBudgets < ActiveRecord::Migration[7.1]
  def change
    create_table :budgets do |t|
      t.references :user, null: false, foreign_key: true
      t.string :category
      t.decimal :amount, precision: 15, scale: 2
      t.datetime :start_date
      t.datetime :end_date

      t.timestamps
    end
  end
end
