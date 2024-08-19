class AddDefaultFinancialCategoryToFinancialStores < ActiveRecord::Migration[7.1]
  def change
    add_column :financial_stores, :default_financial_category, :string
  end
end
