class HealthGoal < ApplicationRecord
  belongs_to :goal, polymorphic: true
end
