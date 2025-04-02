class Transaction < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :account
  belongs_to :category, optional: true
  belongs_to :bank_statement_import, optional: true
  has_many :financial_transaction_taggings, dependent: :destroy
  has_many :financial_tags, through: :financial_transaction_taggings

  # Validations
  validates :amount, :date, presence: true
  validates :amount, numericality: true

  # Callbacks
  before_validation :assign_category, on: :create
  before_save :normalize_description
  after_update :sync_category_to_similar_transactions, if: :saved_change_to_category_id?

  # Scopes
  scope :incoming, -> { where('amount > 0') }
  scope :outgoing, -> { where('amount < 0') }
  scope :between_dates, ->(start_date, end_date) { where(date: start_date..end_date) }
  scope :for_month, ->(date) { between_dates(date.beginning_of_month, date.end_of_month) }
  scope :upcoming, ->(days = 14) { where(next_occurrence: Date.today..days.days.from_now) }
  scope :recurring_upcoming, ->(days = 14) { recurring.upcoming(days) }
  scope :by_category, ->(category_id) { where(category_id: category_id) }
  scope :search, ->(query) { where("description ILIKE ? OR reference ILIKE ?", "%#{query}%", "%#{query}%") }

  # Class method to find similar transactions
  def self.find_similar_transactions(user_id, details = nil, description = nil, amount = nil, limit = 10)
    return [] if [details, description, amount].all?(&:blank?)
    
    query = where(user_id: user_id)
    
    # Match by exact amount if provided (most important criteria)
    query = query.where(amount: amount) if amount.present?
    
    # Match by details field (primary matching criteria)
    query = query.where("details = ?", details) if details.present?
    
    # If no details provided or as a fallback, try matching description
    if details.blank? && description.present?
      query = query.where("description ILIKE ?", "%#{description}%")
    end
    
    # Order by date and limit results
    query.order(date: :desc).limit(limit)
  end

  # Instance methods
  def income?
    amount > 0
  end

  def expense?
    amount < 0
  end

  def absolute_amount
    amount.abs
  end

  # Find similar transactions to this one
  def similar_transactions(limit = 5)
    # Start with transactions from same user, excluding self
    similar = Transaction.where.not(id: id)
                         .where(user_id: user_id)
    
    # First try exact matches on both details and amount
    if details.present?
      exact_matches = similar.where(details: details, amount: amount)
                             .order(date: :desc)
                             .limit(limit)
                             
      return exact_matches if exact_matches.any?
    end
    
    # If no exact details match, try matching on amount and description
    if description.present?
      description_matches = similar.where(amount: amount)
                                  .where("description ILIKE ?", "%#{description}%")
                                  .order(date: :desc)
                                  .limit(limit)
                                  
      return description_matches if description_matches.any?
    end
    
    # As a last resort, just find transactions with the same amount
    amount_matches = similar.where(amount: amount)
                           .order(date: :desc)
                           .limit(limit)
    
    amount_matches
  end

  # Sync category changes to similar transactions
  def sync_category_to_similar_transactions
    return unless category_id.present?
    
    # Find all similar transactions based on exact details and amount
    similar_txns = similar_transactions_for_sync
    
    # Update the category for all similar transactions
    similar_txns.update_all(category_id: category_id)
  end
  
  # Find similar transactions for category sync
  # This method is separate from similar_transactions to allow for different criteria
  # specifically for category syncing
  def similar_transactions_for_sync
    query = Transaction.where.not(id: id)
                      .where(user_id: user_id)
    
    # For category sync, we're strict about matching details and amount
    if details.present?
      query = query.where(details: details, amount: amount)
    else
      # If no details, fall back to description and amount
      query = query.where(amount: amount)
                   .where("description ILIKE ?", "%#{description}%")
    end
    
    query
  end

  # Assign category to transaction based on description or hot words
  def assign_category
    # First try to categorize based on hot words in description
    self.category = find_category_by_description || default_category
  end

  # Match category based on description content or keywords
  def find_category_by_description
    return nil unless description.present?
    
    description_words = description.downcase.split(/\W+/)
    
    Category.find_each do |category|
      # Include category name and keywords for matching
      category_keywords = category.keywords&.split(',')&.map(&:strip)&.map(&:downcase) || []
      category_keywords << category.name.downcase
      
      # If any word from description matches category keywords
      return category if (description_words & category_keywords).any?
    end
    
    nil
  end

  def default_category
    Category.find(12)
  end

  def normalize_description
    self.description = description.strip.titleize if description.present?
  end
end