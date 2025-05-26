class Habit < ApplicationRecord
  belongs_to :user
  belongs_to :goal, optional: true
  belongs_to :task, optional: true

  has_many :habit_logs, dependent: :destroy

  validates :name, presence: true
  validates :frequency, presence: true
  validates :habit_type, inclusion: { in: %w[positive negative] }
  validates :status, inclusion: { in: %w[active completed archived] }
  validates :duration_unit, inclusion: { in: %w[days weeks] }, allow_nil: true
  validates :target_duration, numericality: { greater_than: 0 }, allow_nil: true
  validates :target_occurrences, numericality: { greater_than: 0 }, allow_nil: true

  # Scopes
  scope :positive, -> { where(habit_type: 'positive') }
  scope :negative, -> { where(habit_type: 'negative') }
  scope :active, -> { where(status: 'active') }
  scope :completed, -> { where(status: 'completed') }
  scope :due_today, -> { where('reminder_days @> ARRAY[?]::varchar[]', [Time.current.strftime('%A').downcase]) }

  # Methods
  def completed?
    status == 'completed'
  end

  def complete!
    update(status: 'completed', completed_at: Time.current)
    update_streak_stats
  end

  def update_streak_stats
    current = current_streak
    update(
      longest_streak: [longest_streak, current].max,
      success_rate: calculate_success_rate
    )
  end

  def calculate_success_rate
    return 0 if start_date.nil? || end_date.nil?
    
    total_days = (end_date - start_date).to_i
    return 0 if total_days.zero?
    
    successful_days = habit_logs.where('occurrences >= ?', target_occurrences).count
    (successful_days.to_f / total_days * 100).round(2)
  end

  def is_due_today?
    return false if completed?
    
    case frequency
    when 'daily'
      true
    when 'weekly'
      reminder_days.include?(Time.current.strftime('%A').downcase)
    when 'monthly'
      Time.current.day == start_date.day
    end
  end

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

  def progress_percentage
    return 0 if target_duration.nil? || start_date.nil?
    
    days_elapsed = (Time.current.to_date - start_date).to_i
    (days_elapsed.to_f / target_duration * 100).round(2)
  end
end
