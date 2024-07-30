# app/models/category.rb
class Category < ApplicationRecord
  has_many :expenses

  validates :name, presence: true, uniqueness: true
  validates :category_type, presence: true, inclusion: { in: %w[expense income transaction] }
end
