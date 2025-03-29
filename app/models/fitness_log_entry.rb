class FitnessLogEntry < ApplicationRecord
  belongs_to :user
  belongs_to :routine, optional: true
  has_many :fitness_log_exercises, dependent: :destroy
  accepts_nested_attributes_for :fitness_log_exercises, allow_destroy: true

  validates :date, presence: true
  validates :time, presence: true

  def datetime
    return nil unless date && time
    DateTime.new(date.year, date.month, date.day, time.hour, time.min, time.sec)
  end

  def majority_type
    return nil unless fitness_log_exercises.exists?
  
    type_counts = fitness_log_exercises
                  .joins(exercise: :exercise_type)
                  .group("exercise_types.name")
                  .count
  
    type_counts.max_by { |_name, count| count }&.first
  end

  def self.entries_this_week(user)
    where(user: user, date: Date.today.beginning_of_week..Date.today.end_of_week)
  end
end
