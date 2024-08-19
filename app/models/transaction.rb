class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :account
  belongs_to :financial_store, optional: true
  belongs_to :bank_statement_import, optional: true
  has_many :financial_transaction_taggings
  has_many :financial_tags, through: :financial_transaction_taggings

  validates :amount, :transaction_date, presence: true

  # Match the reference to a store, or create a new store if no match is found
  def self.match_store(reference)
    store = FinancialStore.find_by("name ILIKE ?", "%#{reference}%")
    store || create_new_store(reference)
  end

  # Create a new store with the given reference name
  def self.create_new_store(reference)
    FinancialStore.create(name: reference, default_financial_category: "Uncategorized")
  end

  private

  def valid_transaction_date
    errors.add(:transaction_date, "is not a valid date") if transaction_date.nil?
  end

  def positive_amount
    errors.add(:amount, "must be positive") if amount.nil? || amount <= 0
  end

  def assign_category
    if financial_store
      self.financial_category = financial_store.default_financial_category
    else
      self.financial_category = "Uncategorized"
    end
  end
end
