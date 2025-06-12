class ChoreRotationUser < ApplicationRecord
  belongs_to :chore_rotation
  belongs_to :user, optional: true

  validates :name, presence: true
  validates :position, presence: true, uniqueness: { scope: :chore_rotation_id }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_nil: true

  before_validation :set_position, on: :create

  private

  def set_position
    return if position.present?
    self.position = (chore_rotation.chore_rotation_users.maximum(:position) || 0) + 1
  end
end 