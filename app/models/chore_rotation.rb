class ChoreRotation < ApplicationRecord
  belongs_to :chore_chart
  belongs_to :chore
  has_many :chore_rotation_users, dependent: :destroy
  has_many :users, through: :chore_rotation_users

  validates :rotation_number, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :completed, inclusion: { in: [true, false] }
  validate :end_date_after_start_date

  scope :current, -> { where('start_date <= ? AND end_date >= ?', Time.current, Time.current) }
  scope :completed, -> { where(completed: true) }
  scope :incomplete, -> { where(completed: false) }
  scope :upcoming, -> { where('start_date > ?', Date.current).order(:start_date) }
  scope :past, -> { where('end_date < ?', Date.current).order(end_date: :desc) }

  def current_user
    chore_rotation_users.find_by(position: chore_chart.current_rotation)
  end

  def next_user
    next_position = (current_user&.position || 0) + 1
    chore_rotation_users.find_by(position: next_position) || chore_rotation_users.first
  end

  private

  def end_date_after_start_date
    return if end_date.blank? || start_date.blank?

    if end_date < start_date
      errors.add(:end_date, "must be after the start date")
    end
  end
end 