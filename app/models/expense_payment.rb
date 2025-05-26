class ExpensePayment < ApplicationRecord
  belongs_to :expense
  belongs_to :user

  validates :date, presence: true
  validates :expense_id, presence: true
  validates :user_id, presence: true
  validates :date, uniqueness: { scope: :expense_id, message: "has already been marked as paid for this expense" }

  scope :for_date, ->(date) { where(date: date) }
end 