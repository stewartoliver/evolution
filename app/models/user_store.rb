# app/models/user_store.rb
class UserStore < ApplicationRecord
  belongs_to :user
  belongs_to :financial_store

  validates :custom_name, presence: true, uniqueness: { scope: :user_id }
end
