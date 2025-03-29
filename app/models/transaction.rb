class Transaction < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :account
  belongs_to :financial_store, optional: true
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

  # Enums
  enum transaction_type: { 
    regular: 0, 
    recurring: 1, 
    transfer: 2, 
    refund: 3 
  }, _default: :regular

  # Scopes
  scope :incoming, -> { where('amount > 0') }
  scope :outgoing, -> { where('amount < 0') }
  scope :between_dates, ->(start_date, end_date) { where(date: start_date..end_date) }
  scope :for_month, ->(date) { between_dates(date.beginning_of_month, date.end_of_month) }
  scope :upcoming, ->(days = 14) { where(next_occurrence: Date.today..days.days.from_now) }
  scope :recurring_upcoming, ->(days = 14) { recurring.upcoming(days) }
  scope :by_category, ->(category_id) { where(category_id: category_id) }
  scope :by_store, ->(store_id) { where(financial_store_id: store_id) }
  scope :search, ->(query) { where("description ILIKE ? OR reference ILIKE ?", "%#{query}%", "%#{query}%") }

  # Class methods
  def self.match_store(reference)
    return nil if reference.blank?
    
    # Try exact match first
    store = FinancialStore.find_by("LOWER(name) = LOWER(?)", reference)
    return store if store
    
    # Try partial match
    store = FinancialStore.where("name ILIKE ?", "%#{reference}%").order(transaction_count: :desc).first
    return store if store
    
    # Create new store if no match
    create_new_store(reference)
  end

  def self.create_new_store(reference)
    FinancialStore.create(
      name: reference.titleize, 
      default_category: "Uncategorized",
      transaction_count: 1
    )
  end

  # Group transactions by month for reporting
  def self.monthly_summary(year = Date.today.year)
    select("DATE_TRUNC('month', date) as month, SUM(amount) as total_amount, COUNT(*) as transaction_count")
      .where("EXTRACT(YEAR FROM date) = ?", year)
      .group("DATE_TRUNC('month', date)")
      .order("month")
  end

  # Similar transactions finder methods
  def self.find_recurring_pattern(user_id, reference = nil, description = nil, amount = nil, limit = 10)
    return [] if [reference, description, amount].all?(&:blank?)
    
    query = where(user_id: user_id)
    
    # Match by exact amount if provided
    query = query.where(amount: amount) if amount.present?
    
    # Match by reference OR description
    if reference.present? && description.present?
      query = query.where("reference ILIKE ? OR description ILIKE ?", "%#{reference}%", "%#{description}%")
    elsif reference.present?
      query = query.where("reference ILIKE ?", "%#{reference}%")
    elsif description.present?
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
  query = Transaction.where.not(id: id).where(user_id: user_id)
  
  # Match by amount with small tolerance for currency fluctuations
  amount_range = (amount * 0.99)..(amount * 1.01)
  
  # Build conditions for reference and description
  conditions = []
  params = []
  
  # Add amount condition
  conditions << "amount BETWEEN ? AND ?"
  params << amount_range.begin
  params << amount_range.end
  
  # Add reference condition if present
  if reference.present?
    conditions << "reference ILIKE ?"
    params << "%#{reference}%"
  end
  
  # Add description condition if present
  if description.present?
    conditions << "description ILIKE ?"
    params << "%#{description}%"
  end
  
  # Construct the where clause - require matching amount AND (reference OR description if provided)
  where_clause = conditions.join(" AND ")
  
  # Execute the query
  similar = Transaction.where.not(id: id)
                      .where(user_id: user_id)
                      .where(where_clause, *params)
                      .order(date: :desc)
                      .limit(limit)
  
  # If no results, try with just the amount
  if similar.empty? && (reference.present? || description.present?)
    similar = Transaction.where.not(id: id)
                        .where(user_id: user_id)
                        .where(amount: amount_range)
                        .order(date: :desc)
                        .limit(limit)
  end
  
  similar
end

  # Identify potential recurring transactions
  def find_potential_recurring_pattern(months_back = 6, variation_percentage = 5)
    # Calculate date range
    end_date = date
    start_date = (end_date - months_back.months).beginning_of_month
    
    # Define amount range with variation tolerance
    min_amount = amount * (1 - variation_percentage/100.0)
    max_amount = amount * (1 + variation_percentage/100.0)
    
    # Find similar transactions in date range
    similar_in_period = Transaction.where.not(id: id)
                                  .where(user_id: user_id)
                                  .where(amount: min_amount..max_amount)
                                  .where(date: start_date..end_date)
    
    # Try to match with financial_store first
    if financial_store_id.present?
      store_matches = similar_in_period.where(financial_store_id: financial_store_id)
      return analyze_recurrence_pattern(store_matches) if store_matches.any?
    end
    
    # If no store matches, try matching by reference/description
    if reference.present?
      ref_matches = similar_in_period.where("reference ILIKE ?", "%#{reference}%")
      return analyze_recurrence_pattern(ref_matches) if ref_matches.any?
    end
    
    if description.present?
      desc_matches = similar_in_period.where("description ILIKE ?", "%#{description}%") 
      return analyze_recurrence_pattern(desc_matches) if desc_matches.any?
    end
    
    # No pattern found
    {}
  end

  # Update recurring transaction and schedule next occurrence
  def schedule_next_occurrence
    return unless recurring?
    
    # Logic to calculate next occurrence based on frequency
    self.next_occurrence = calculate_next_occurrence
    save
  end

  def calculate_next_occurrence
    case recurring_frequency
    when 'daily'
      date + 1.day
    when 'weekly'
      date + 1.week
    when 'biweekly'
      date + 2.weeks
    when 'monthly'
      date + 1.month
    when 'quarterly'
      date + 3.months
    when 'yearly'
      date + 1.year
    else
      date + 1.month # Default to monthly
    end
  end

  # Recategorize transaction and update store's default category
  def recategorize(new_category_id, update_store_default = false)
    return false unless new_category_id.present?
    
    transaction do
      update(category_id: new_category_id)
      
      if update_store_default && financial_store.present?
        category_name = Category.find(new_category_id).name
        financial_store.update(default_category: category_name)
      end
    end
    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  private

  def assign_category
    # First try to categorize based on financial store
    if financial_store&.default_category.present?
      category = Category.find_or_create_by!(
        name: financial_store.default_category,
        user: user
      )
      self.category = category
      return
    end

    # Then try with description-based algorithms
    self.category = find_category_by_description || default_category
  end

  def find_category_by_description
    return nil unless description.present?
    
    # Try to match with existing categories using more sophisticated matching
    description_words = description.downcase.split(/\W+/)
    
    # Find categories that match any word in the description
    Category.where(user: user).find_each do |category|
      category_keywords = category.keywords&.split(',')&.map(&:strip)&.map(&:downcase) || []
      category_keywords << category.name.downcase
      
      return category if (description_words & category_keywords).any?
    end
    
    nil
  end

  def default_category
    Category.find_or_create_by!(name: 'Uncategorized', user: user)
  end

  def normalize_description
    self.description = description.strip.titleize if description.present?
  end

  # Helper method to analyze patterns in potentially recurring transactions
  def analyze_recurrence_pattern(transactions)
    return {} if transactions.size < 2
    
    # Include the current transaction in the analysis
    all_transactions = transactions + [self]
    all_transactions = all_transactions.sort_by(&:date)
    
    # Calculate intervals between consecutive transactions
    intervals = []
    all_transactions.each_cons(2) do |prev_tx, next_tx|
      intervals << (next_tx.date - prev_tx.date).to_i
    end
    
    return {} if intervals.empty?
    
    # Calculate the average interval
    avg_interval = intervals.sum / intervals.size.to_f
    
    # Determine most likely frequency
    frequency = case avg_interval
                when 0..5 then 'daily'
                when 6..10 then 'weekly'
                when 11..18 then 'biweekly'
                when 19..45 then 'monthly'
                when 46..100 then 'quarterly'
                else 'yearly'
                end
    
    # Determine consistency - standard deviation as percentage of mean
    std_dev = Math.sqrt(intervals.sum { |i| (i - avg_interval)**2 } / intervals.size)
    consistency = 100 - (std_dev / avg_interval * 100).round
    
    # Next predicted date
    next_predicted = date + avg_interval.days
    
    {
      transactions: all_transactions,
      frequency: frequency,
      avg_interval_days: avg_interval.round,
      consistency_percentage: consistency,
      next_predicted_date: next_predicted,
      sample_size: all_transactions.size
    }
  end
end