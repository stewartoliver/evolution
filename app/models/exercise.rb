class Exercise < ApplicationRecord
	belongs_to :user, foreign_key: 'added_by_id'
	belongs_to :approved_by, class_name: 'User', foreign_key: 'approved_by_id', optional: true
	belongs_to :muscle_group
	belongs_to :exercise_type

	has_many :routine_exercises

	
	has_many :fitness_log_exercises
	has_many :fitness_goals

	accepts_nested_attributes_for :routine_exercises, allow_destroy: true
end
