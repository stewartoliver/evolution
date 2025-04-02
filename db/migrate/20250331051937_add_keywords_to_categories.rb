class AddKeywordsToCategories < ActiveRecord::Migration[7.1]
  def change
    add_column :categories, :keywords, :string
  end
end
