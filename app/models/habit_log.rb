class HabitLog < ApplicationRecord
  belongs_to :habit

  validates :date, presence: true
  validates :occurrences, numericality: { greater_than_or_equal_to: 0 }
  validates :difficulty_level, inclusion: { in: 1..5 }, allow_nil: true
  validates :mood, inclusion: { in: %w[great good neutral bad terrible] }, allow_nil: true

  before_save :update_habit_stats

  private

  def update_habit_stats
    habit.update_streak_stats if habit.present?
  end
end
