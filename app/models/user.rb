class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable

  has_many :accounts
  has_many :user_stores
  has_many :stores, through: :user_stores
  has_many :expenses

  has_many :routines
  has_many :fitness_log_entries

  has_many :goals
  has_many :tasks, through: :goals
  has_many :achievements, through: :goals
end
