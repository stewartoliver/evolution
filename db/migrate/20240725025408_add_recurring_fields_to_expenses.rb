class AddRecurringFieldsToExpenses < ActiveRecord::Migration[7.1]
  def change
    add_column :expenses, :recurring, :boolean, default: false
    add_column :expenses, :frequency, :string
    add_column :expenses, :next_occurrence, :date
    add_column :expenses, :end_date, :date
  end
end
