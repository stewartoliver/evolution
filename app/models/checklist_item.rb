class ChecklistItem < ApplicationRecord
  belongs_to :checklist
  acts_as_list scope: :checklist

  validates :text, presence: true
  validates :completed, inclusion: { in: [true, false] }

  default_scope { order(position: :asc) }

  before_save :update_completed_at

  private

  def update_completed_at
    if saved_change_to_completed?
      self.completed_at = completed? ? Time.current : nil
    end
  end
end 