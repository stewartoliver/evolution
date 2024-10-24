# app/services/transaction_categorizer.rb

class TransactionCategorizer
  def initialize(transaction)
    @transaction = transaction
    @user = transaction.user
    @description = transaction.description.to_s.downcase
    @financial_store = transaction.financial_store
  end

  def categorize
    if @financial_store&.default_category.present?
      category = Category.find_or_create_by!(
        name: @financial_store.default_category,
        user: @user
      )
      @transaction.category = category
    else
      category = find_category_by_keywords || default_category
      @transaction.category = category
    end
  end

  private

  def find_category_by_keywords
    Category.where(user: @user).or(Category.where(user: nil)).find do |category|
      category.matches?(@description)
    end
  end

  def default_category
    Category.find_or_create_by!(name: 'Uncategorized', user: @user)
  end
end
