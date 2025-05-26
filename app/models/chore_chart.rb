class ChoreChart < ApplicationRecord
  belongs_to :user
  has_many :chores, dependent: :destroy
  # For future: has_many :chore_assignments
end
