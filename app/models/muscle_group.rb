class MuscleGroup < ApplicationRecord
  has_many :muscle_group_muscles, dependent: :destroy
  has_many :muscles, through: :muscle_group_muscles
  has_many :exercises, through: :muscles
  
  validates :name, presence: true, uniqueness: true
end