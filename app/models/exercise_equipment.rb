class ExerciseEquipment < ApplicationRecord
  self.table_name = 'exercise_equipment'

  belongs_to :exercise
  belongs_to :equipment

  validates :exercise_id, uniqueness: { scope: :equipment_id }
end 