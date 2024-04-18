class Routine < ApplicationRecord
	belongs_to :user
	belongs_to :approved_by, class_name: 'User', foreign_key: 'approved_by_id', optional: true
	has_many :routine_exercises, dependent: :destroy
	accepts_nested_attributes_for :routine_exercises, allow_destroy: true

   # Validation for name or any other attributes you have
   validates :name, presence: true
end
