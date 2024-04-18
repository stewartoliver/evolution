class RoutineExercise < ApplicationRecord
  belongs_to :routine
  has_many :routine_sets, dependent: :destroy
  accepts_nested_attributes_for :routine_sets, allow_destroy: true

  # Validation for exercise_id or any other attributes you have
  validates :exercise_id, presence: true
end
