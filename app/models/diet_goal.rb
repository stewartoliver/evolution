class DietGoal < ApplicationRecord
  belongs_to :goal, polymorphic: true
end
