class ChoreChartUser < ApplicationRecord
  belongs_to :chore_chart
  belongs_to :user, optional: true

  validates :name, presence: true
  validates :position, presence: true, uniqueness: { scope: :chore_chart_id }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true

  before_validation :set_position, on: :create

  private

  def set_position
    return if position.present?
    max_position = chore_chart.chore_chart_users.maximum(:position) || 0
    self.position = max_position + 1
  end
end 