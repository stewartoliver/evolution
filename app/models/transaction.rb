# app/models/transaction.rb
class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :account
  belongs_to :financial_store, optional: true
  belongs_to :category, optional: true
  belongs_to :bank_statement_import, optional: true
  has_many :financial_transaction_taggings
  has_many :financial_tags, through: :financial_transaction_taggings

  validates :amount, :date, presence: true
  validate :positive_amount

  before_validation :assign_category, on: :create

  # Scopes
  scope :recurring, -> { where(transaction_type: 'recurring') }
  scope :upcoming, ->(days = 14) { where(next_occurrence: Date.today..days.days.from_now) }
  scope :recurring_upcoming, ->(days = 14) { recurring.upcoming(days) }

  # Match the reference to a store, or create a new store if no match is found
  def self.match_store(reference)
    store = FinancialStore.find_by("name ILIKE ?", "%#{reference}%")
    store || create_new_store(reference)
  end

  # Create a new store with the given reference name
  def self.create_new_store(reference)
    FinancialStore.create(name: reference, default_category: "Uncategorized")
  end

  private

  def positive_amount
    errors.add(:amount, "must be positive") if amount.nil? || amount <= 0
  end

  def assign_category
    # Assign category based on financial_store's default category
    if financial_store&.default_category.present?
      self.category = FinancialCategory.find_or_create_by!(
        name: financial_store.default_category,
        user: user
      )
    else
      # Attempt to categorize based on description or store_name
      self.category = categorize_based_on_description_or_store
    end
  end

  def categorize_based_on_description_or_store
    # Simple matching logic; can be expanded or moved to a service object
    if description.present?
      category = FinancialCategory.find_by("name ILIKE ?", "%#{description.split.first}%")
      return category if category
    end

    # Default category if no match found
    FinancialCategory.find_or_create_by!(name: 'Uncategorized', user: user)
  end
end
