class MuscleGroupMuscle < ApplicationRecord
  belongs_to :muscle_group
  belongs_to :muscle

  validates :muscle_group_id, uniqueness: { scope: :muscle_id }
  validates :primary_order, presence: true
end 