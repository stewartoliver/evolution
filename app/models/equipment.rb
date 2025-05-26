class Equipment < ApplicationRecord
  has_many :exercise_equipment, dependent: :destroy
  has_many :exercises, through: :exercise_equipment
  
  validates :name, presence: true, uniqueness: true
end 