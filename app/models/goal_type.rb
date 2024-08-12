# app/models/goal_type.rb
class GoalType < ApplicationRecord
  has_many :goals
end
