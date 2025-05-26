class Checklist < ApplicationRecord
  belongs_to :task
  has_many :checklist_items, dependent: :destroy

  validates :title, presence: true

  accepts_nested_attributes_for :checklist_items, allow_destroy: true

  default_scope { order(created_at: :asc) }
end 