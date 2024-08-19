class BankStatementImport < ApplicationRecord
  belongs_to :user
  has_many :transactions

  validates :transaction_type, :amount, :transaction_date, presence: true
end
