class RoutineSet < ApplicationRecord
	belongs_to :routine_exercise

	validates :reps, presence: true
	validates :weight, presence: true
end
