class Habit < ApplicationRecord
  belongs_to :user
  belongs_to :goal, optional: true
  belongs_to :task, optional: true

  has_many :habit_logs, dependent: :destroy

  validates :name, presence: true
  validates :frequency, presence: true

  def current_streak
    return 0 if habit_logs.empty?

    # Get unique dates from habit logs, ordered by date descending
    dates = habit_logs.pluck(:date).uniq.sort.reverse

    # If no dates, return 0
    return 0 if dates.empty?

    # Check if the most recent log was more than one day ago
    most_recent = dates.first
    return 0 if most_recent < 1.day.ago.to_date

    streak = 1
    current_date = most_recent

    # Count consecutive days
    dates[1..].each do |date|
      if date == current_date - 1
        streak += 1
        current_date = date
      else
        break
      end
    end

    streak
  end
end
