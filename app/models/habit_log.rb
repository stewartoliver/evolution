class HabitLog < ApplicationRecord
  belongs_to :habit

  validates :date, presence: true
  validates :occurrences, numericality: { greater_than_or_equal_to: 0 }
end
