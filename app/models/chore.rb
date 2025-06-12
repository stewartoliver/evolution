class Chore < ApplicationRecord
  belongs_to :user
  belongs_to :chore_chart, optional: true
  # For future: has_many :chore_assignments
  has_many :chore_logs, dependent: :destroy
  has_many :chore_rotations, dependent: :destroy

  validates :name, presence: true
  validates :position, uniqueness: { scope: :chore_chart_id }, allow_nil: true

  before_validation :set_position, on: :create

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

  private

  def set_position
    return if position.present? || chore_chart_id.blank?
    max_position = chore_chart.chores.maximum(:position) || 0
    self.position = max_position + 1
  end
end
