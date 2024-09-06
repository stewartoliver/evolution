class Habit < ApplicationRecord
  belongs_to :user
  belongs_to :goal, optional: true
  belongs_to :task, optional: true

  has_many :habit_logs, dependent: :destroy

  validates :name, presence: true
  validates :frequency, presence: true
end
