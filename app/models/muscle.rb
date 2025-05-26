class Muscle < ApplicationRecord
  has_many :muscle_group_muscles, dependent: :destroy
  has_many :muscle_groups, through: :muscle_group_muscles
  has_many :exercise_muscles, dependent: :destroy
  has_many :exercises, through: :exercise_muscles
  
  validates :name, presence: true, uniqueness: true
end 