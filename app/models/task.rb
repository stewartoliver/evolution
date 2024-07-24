class Task < ApplicationRecord
  belongs_to :goal

  validates :title, presence: true
  enum status: { todo: 0, in_progress: 1, done: 2 }
end
