class WeightGoal < ApplicationRecord
  belongs_to :goal, polymorphic: true
end
