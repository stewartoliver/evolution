class AddFieldsToExpenses < ActiveRecord::Migration[7.1]
  def change
   add_column :expenses, :custom_frequency, :integer
   add_column :expenses, :frequency_unit, :string
   add_column :expenses, :day_of_week, :integer
   add_column :expenses, :day_of_month, :integer
   add_column :expenses, :user_id, :integer

    # Optionally, you can add an index for user_id if you plan to query by it often
    add_index :expenses, :user_id
  end
end
