class ChoreChartChore < ApplicationRecord
  belongs_to :chore_chart
  belongs_to :chore
  belongs_to :assigned_user, class_name: 'ChoreChartUser', optional: true

  validates :position, presence: true, uniqueness: { scope: :chore_chart_id }
  validates :chore_id, uniqueness: { scope: :chore_chart_id }

  before_validation :set_position, on: :create

  private

  def set_position
    return if position.present?
    max_position = chore_chart.chore_chart_chores.maximum(:position) || 0
    self.position = max_position + 1
  end
end 