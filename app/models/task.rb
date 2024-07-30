class Task < ApplicationRecord
  belongs_to :goal
  belongs_to :user

  validates :title, presence: true
  enum status: { todo: 0, in_progress: 1, done: 2 }

  after_save :update_goal_progress

  private

  def update_goal_progress
    goal.update_progress
  end
end
