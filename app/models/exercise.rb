class Exercise < ApplicationRecord
	belongs_to :user, foreign_key: 'added_by_id'
	belongs_to :approved_by, class_name: 'User', foreign_key: 'approved_by_id', optional: true
	belongs_to :exercise_type
	belongs_to :muscle_group

	has_many :routine_exercises, dependent: :destroy
	has_many :fitness_log_exercises, dependent: :destroy
	has_many :fitness_goals, dependent: :destroy

	has_many :exercise_muscles, dependent: :destroy
	has_many :muscles, through: :exercise_muscles
	has_many :primary_muscles, -> { 
		select('DISTINCT ON (muscles.id) muscles.*, exercise_muscles.importance_order')
		.joins(:exercise_muscles)
		.where(exercise_muscles: { muscle_type: 'primary' })
		.order('muscles.id, exercise_muscles.importance_order ASC')
	}, through: :exercise_muscles, source: :muscle

	has_many :secondary_muscles, -> { 
		select('DISTINCT ON (muscles.id) muscles.*, exercise_muscles.importance_order')
		.joins(:exercise_muscles)
		.where(exercise_muscles: { muscle_type: 'secondary' })
		.order('muscles.id, exercise_muscles.importance_order ASC')
	}, through: :exercise_muscles, source: :muscle

	has_many :muscle_groups, -> { distinct }, through: :muscles

	has_many :exercise_equipment, dependent: :destroy
	has_many :equipment, through: :exercise_equipment

	accepts_nested_attributes_for :routine_exercises, allow_destroy: true
	accepts_nested_attributes_for :exercise_muscles, allow_destroy: true
	accepts_nested_attributes_for :exercise_equipment, allow_destroy: true

	validates :name, presence: true, uniqueness: true
	validates :exercise_type_id, presence: true
	validates :muscle_group_id, presence: true
	validates :added_by_id, presence: true
end
