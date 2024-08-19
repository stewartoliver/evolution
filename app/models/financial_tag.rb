class FinancialTag < ApplicationRecord
  belongs_to :user
  has_many :financial_transaction_taggings
  has_many :transactions, through: :financial_transaction_taggings

  validates :name, presence: true
end
