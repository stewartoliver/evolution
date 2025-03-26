class FitnessLogExercise < ApplicationRecord
  belongs_to :fitness_log_entry
  belongs_to :exercise
  has_many :fitness_log_sets, dependent: :destroy
  accepts_nested_attributes_for :fitness_log_sets, allow_destroy: true

  validates :exercise_id, presence: true
end
