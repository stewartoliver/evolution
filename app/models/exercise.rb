class Exercise < ApplicationRecord
	belongs_to :user, foreign_key: 'added_by_id'
	belongs_to :approved_by, class_name: 'User', foreign_key: 'approved_by_id', optional: true
	belongs_to :muscle_group
	belongs_to :exercise_type
	has_many :fitness_log_exercises
end
