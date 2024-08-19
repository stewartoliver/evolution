class FinancialTransactionTagging < ApplicationRecord
  belongs_to :transaction, class_name: 'Transaction', foreign_key: 'financial_transaction_id'
  belongs_to :financial_tag
end
