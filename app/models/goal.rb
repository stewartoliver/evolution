class Goal < ApplicationRecord
	belongs_to :user
	has_many :sub_goals, class_name: "Goal", foreign_key: "parent_goal_id", dependent: :destroy
	belongs_to :parent_goal, class_name: "Goal", optional: true
	has_many :tasks, dependent: :destroy

	def update_progress
		total_tasks = tasks.count
		completed_tasks = tasks.done.count
		self.progress = total_tasks > 0 ? (completed_tasks.to_f / total_tasks * 100).round : 0
		save
	end
end