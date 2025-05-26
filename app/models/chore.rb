class Chore < ApplicationRecord
  belongs_to :user
  belongs_to :chore_chart, optional: true
  # For future: has_many :chore_assignments
  has_many :chore_logs, dependent: :destroy

  scope :upcoming, -> {
    where('next_due_at <= ?', 7.days.from_now)
    .where('next_due_at >= ?', Time.current)
    .order(:next_due_at)
  }

  def days_until_due
    ((next_due_at.to_date - Date.current).to_i)
  end

  def update_next_due_date
    case repeat_rule
    when 'Daily'
      self.next_due_at = Time.current + repeat_every.days
    when 'Weekly'
      self.next_due_at = Time.current + (repeat_every * 7).days
    when 'Every X Days'
      self.next_due_at = Time.current + repeat_every.days
    end
    save
  end
end
