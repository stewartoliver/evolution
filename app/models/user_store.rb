# app/models/user_store.rb
class UserStore < ApplicationRecord
  belongs_to :user
  belongs_to :store

  validates :custom_name, presence: true, uniqueness: { scope: :user_id }
end
