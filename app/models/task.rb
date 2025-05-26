class Task < ApplicationRecord
  belongs_to :goal, optional: true
  belongs_to :user
  belongs_to :parent_task, class_name: 'Task', optional: true
  has_many :subtasks, class_name: 'Task', foreign_key: 'parent_task_id', dependent: :destroy
  has_many :checklists, dependent: :destroy
  has_many :habits, dependent: :destroy

  validates :title, presence: true
  validates :status, presence: true
  validates :user_id, presence: true

  enum status: { todo: 0, in_progress: 1, done: 2 }

  scope :completed, -> { where.not(completed_at: nil) }
  scope :remaining, -> { where.not(status: 2) }
  scope :root_tasks, -> { where(parent_task_id: nil) }
  scope :ordered, -> { order(position: :asc) }

  # Use a single callback for create, update, and destroy events
  after_create :handle_task_change
  after_update :handle_task_change
  after_destroy :handle_task_change

  accepts_nested_attributes_for :checklists, allow_destroy: true
  accepts_nested_attributes_for :subtasks, allow_destroy: true

  def update_progress
    return unless goal
    goal.update_progress
  end

  private

  def handle_task_change
    update_goal_progress
    update_completed_at
  end

  def update_goal_progress
    goal&.update_progress
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
