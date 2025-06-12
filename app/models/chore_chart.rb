class ChoreChart < ApplicationRecord
  belongs_to :user
  has_many :chores, -> { order(position: :asc) }, dependent: :destroy
  has_many :chore_rotations, dependent: :destroy
  has_many :chore_chart_users, -> { order(position: :asc) }, dependent: :destroy
  has_many :users, through: :chore_chart_users

  validates :name, presence: true
  validates :rotation_frequency, presence: true, if: :rotation_day?
  validates :rotation_day, presence: true, if: :rotation_frequency?

  after_create :add_creator_as_user

  def add_chore(chore_id)
    chore = Chore.find(chore_id)
    return false if chore.chore_chart_id.present?

    max_position = chores.maximum(:position) || 0
    chore.update!(
      chore_chart_id: id,
      position: max_position + 1
    )
    true
  end

  def remove_chore(chore_id)
    chore = chores.find(chore_id)
    return false unless chore

    chore.update!(chore_chart_id: nil, position: nil)
    reorder_positions
    true
  end

  def reorder_chores(chore_ids)
    return false unless chore_ids.is_a?(Array)

    transaction do
      chore_ids.each_with_index do |chore_id, index|
        chores.find(chore_id)&.update!(position: index + 1)
      end
    end
    true
  end

  def current_rotation
    return nil unless rotation_frequency.present? && start_date.present?

    case rotation_frequency
    when 'daily'
      days_since_start = (Date.current - start_date.to_date).to_i
      days_since_start % chores.count
    when 'weekly'
      weeks_since_start = ((Date.current - start_date.to_date) / 7).to_i
      weeks_since_start % chores.count
    when 'biweekly'
      weeks_since_start = ((Date.current - start_date.to_date) / 7).to_i
      (weeks_since_start / 2) % chores.count
    when 'monthly'
      months_since_start = ((Date.current.year * 12 + Date.current.month) - (start_date.year * 12 + start_date.month))
      months_since_start % chores.count
    end
  end

  def current_rotation_chores
    return [] unless current_rotation.present?
    
    rotation_size = (chores.count.to_f / 4).ceil # Split chores into 4 groups
    start_index = (current_rotation * rotation_size) % chores.count
    end_index = (start_index + rotation_size - 1) % chores.count
    
    if end_index >= start_index
      chores.offset(start_index).limit(rotation_size)
    else
      chores.offset(start_index) + chores.limit(end_index + 1)
    end
  end

  def current_rotation_user
    return nil if chore_chart_users.empty?
    current_position = (Time.current.to_i / rotation_frequency_in_seconds) % chore_chart_users.count
    chore_chart_users.find_by(position: current_position)
  end

  def next_rotation_date
    return nil if rotation_frequency.blank?
    current_rotation_start = Time.current.beginning_of_day
    next_rotation_start = current_rotation_start + rotation_frequency_in_seconds
    next_rotation_start
  end

  private

  def reorder_positions
    chores.order(:position).each_with_index do |chore, index|
      chore.update!(position: index + 1)
    end
  end

  def rotation_day_index
    %w[Monday Tuesday Wednesday Thursday Friday Saturday Sunday].index(rotation_day)
  end

  def rotation_frequency_in_seconds
    case rotation_frequency
    when 'daily'
      1.day.to_i
    when 'weekly'
      1.week.to_i
    when 'biweekly'
      2.weeks.to_i
    when 'monthly'
      1.month.to_i
    else
      1.week.to_i
    end
  end

  def add_creator_as_user
    return unless user.present?
    
    # Only create if no users exist
    return if chore_chart_users.exists?
    
    chore_chart_users.create!(
      name: user.name,
      email: user.email,
      user_id: user.id,
      position: 1
    )
  end
end
