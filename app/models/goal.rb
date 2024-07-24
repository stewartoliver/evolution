class Goal < ApplicationRecord
	belongs_to :user
	has_many :sub_goals, class_name: "Goal", foreign_key: "parent_goal_id", dependent: :destroy
	belongs_to :parent_goal, class_name: "Goal", optional: true
	has_many :tasks, dependent: :destroy
end