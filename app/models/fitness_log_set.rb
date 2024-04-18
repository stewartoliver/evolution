class FitnessLogSet < ApplicationRecord
  belongs_to :fitness_log_exercise

  validates :reps, presence: true
  validates :weight, presence: true
end
