class Account < ApplicationRecord
	belongs_to :user
	has_many :transactions
	has_many :incomes
	has_many :expenses
end
