class FinanceGoal < ApplicationRecord
  belongs_to :goal, polymorphic: true
end
