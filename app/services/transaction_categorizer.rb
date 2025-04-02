# app/services/transaction_categorizer.rb

class TransactionCategorizer
  def initialize(transaction)
    @transaction = transaction
    @user = transaction.user
    @text = "#{transaction.details} #{transaction.description}".to_s.downcase
  end

  def categorize
    category = find_category_by_keywords || default_category
    @transaction.category = category
  end

  private

  def find_category_by_keywords
    # Search for categories with names or keywords matching the transaction text
    Category.all.each do |category|
      category_keywords = category.keywords&.split(',')&.map(&:strip)&.map(&:downcase) || []
      category_keywords << category.name.downcase  # Include category name as a keyword

      return category if category_keywords.any? { |keyword| @text.include?(keyword) }
    end
    nil
  end

  def default_category
    Category.find(12) # Ensure ID 12 exists
  end
end
