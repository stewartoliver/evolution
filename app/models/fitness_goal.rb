class FitnessGoal < ApplicationRecord
  belongs_to :goal, polymorphic: true
  belongs_to :exercise

end
