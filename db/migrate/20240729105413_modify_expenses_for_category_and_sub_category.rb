class ModifyExpensesForCategoryAndSubCategory < ActiveRecord::Migration[7.1]
  def change
    rename_column :expenses, :category, :sub_category
    add_column :expenses, :category_id, :integer
    add_foreign_key :expenses, :categories, column: :category_id
  end
end
