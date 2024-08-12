class UserWeightHistory < ApplicationRecord
  belongs_to :user

  # Validations
  validates :weight, presence: true, numericality: { greater_than: 0 }
  validates :recorded_at, presence: true
end
