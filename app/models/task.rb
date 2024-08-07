class Task < ApplicationRecord
  belongs_to :goal
  belongs_to :user

  validates :title, presence: true
  validates :status, presence: true
  validates :goal_id, presence: true
  enum status: { todo: 0, in_progress: 1, done: 2 }

  after_create :update_goal_progress
  after_update :update_goal_progress
  after_destroy :update_goal_progress

  private

  def update_goal_progress
    goal.update_progress
  end
end