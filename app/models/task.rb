class Task < ApplicationRecord
  belongs_to :goal
  belongs_to :user
  has_many :habits, dependent: :destroy

  validates :title, presence: true
  validates :status, presence: true
  validates :goal_id, presence: true
  enum status: { todo: 0, in_progress: 1, done: 2 }

  scope :completed, -> { where.not(completed_at: nil) }
  scope :remaining, -> { where.not(status: 2) }

  # Use a single callback for create, update, and destroy events
  after_create :handle_task_change
  after_update :handle_task_change
  after_destroy :handle_task_change

  private

  def handle_task_change
    update_goal_progress
    update_completed_at
  end

  def update_goal_progress
    goal.update_progress
  end

  def update_completed_at
    if saved_change_to_status?
      if status == "done"
        self.completed_at = Time.current
      elsif completed_at.present?
        self.completed_at = nil
      end
    end
  end
end
