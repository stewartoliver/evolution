class Goal < ApplicationRecord
  belongs_to :user
  has_many :sub_goals, class_name: "Goal", foreign_key: "parent_goal_id", dependent: :destroy
  belongs_to :parent_goal, class_name: "Goal", optional: true
  has_many :tasks, dependent: :destroy
  has_many :achievements, dependent: :destroy

  attribute :completed_at, :datetime
  attribute :generation, :integer, default: 0

  enum status: {not_started: 'not_started', in_progress: 'in_progress', completed: 'completed', on_hold: 'on_hold', cancelled: 'cancelled' }
  
  # Mark the goal as complete
  def complete!
    self.completed_at = Time.current # Set the completed_at to the current time
    update_progress
    save! # Ensure the changes are saved
    create_achievement if create_achievement? # Optionally create an achievement
  end

  def complete?
    completed_at.present?
  end

  def incomplete_tasks?
    tasks.where('status < ?', 2).any?
  end

  # Complete current goal and create a child goal
  def complete_and_create_child!(child_goal_params)
    transaction do
      complete!
      sub_goals.create!(child_goal_params.merge(user: user, parent_goal: self, generation: generation + 1))
    end
  rescue ActiveRecord::RecordInvalid => e
    errors.add(:base, "Child goal creation failed: #{e.message}")
    false
  end

  # Calculate and update progress
  def update_progress
    total_tasks = tasks.count
    completed_tasks = tasks.where(status: :done).count
    new_progress = total_tasks > 0 ? (completed_tasks.to_f / total_tasks * 100).round : 0

    update_column(:progress, new_progress) if progress != new_progress

    if new_progress == 100 && completed_at.nil?
      update_column(:completed_at, Time.current)
      create_achievement if create_achievement?
    elsif new_progress < 100 && completed_at.present?
      update_column(:completed_at, nil) # Reset if not complete
    end
  end

  # Recursively fetch all ancestor goals
  def ancestor_goals
    ancestors = []
    current_goal = self
    while current_goal.parent_goal.present?
      ancestors << current_goal.parent_goal
      current_goal = current_goal.parent_goal
    end
    ancestors.reverse # Reverse to show the oldest ancestor first
  end

  # Recursively fetch all descendant goals
  def descendant_goals
    descendants = []
    sub_goals.each do |sub_goal|
      descendants << sub_goal
      descendants.concat(sub_goal.descendant_goals)
    end
    descendants
  end

  # Generate a full lineage for display
  def lineage
    ancestor_goals + [self] + descendant_goals
  end

  # Calculate prestige stars based on parent generations
  def prestige_stars
    generation
  end

  private

  # Check if a new achievement should be created
  def create_achievement?
    # Define your conditions for creating an achievement here
    false
  end

  # Method to create an achievement when goal is completed
  def create_achievement
    # Handle achievement creation logic
  end
end
