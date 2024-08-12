class Milestone < ApplicationRecord
  belongs_to :goal
  
  validates :name, :target_value, presence: true

  def complete?
    achieved_value >= target_value
  end
end
