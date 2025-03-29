class Routine < ApplicationRecord
	belongs_to :user
	belongs_to :approved_by, class_name: 'User', foreign_key: 'approved_by_id', optional: true
	has_many :routine_exercises, dependent: :destroy
  
	accepts_nested_attributes_for :routine_exercises, allow_destroy: true
  
	# Validation for name or any other attributes you have
	validates :name, presence: true
  
	# Method to get the last used date from FitnessLogEntry
	def last_used_at
	  FitnessLogEntry.where(routine_id: id).maximum(:created_at)
	end
  end