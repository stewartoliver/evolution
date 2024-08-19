# app/models/store.rb
class FinancialStore < ApplicationRecord
  has_many :user_stores
  has_many :users, through: :user_stores
  has_many :expenses

  validates :name, presence: true, uniqueness: { scope: :chain_name }
end
