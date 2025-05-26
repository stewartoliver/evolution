class ExerciseMuscle < ApplicationRecord
  belongs_to :exercise
  belongs_to :muscle

  validates :muscle_type, presence: true, inclusion: { in: %w[primary secondary] }
  validates :importance_order, presence: true
  validates :exercise_id, uniqueness: { scope: [:muscle_id, :muscle_type] }
end 