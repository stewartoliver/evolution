# app/models/expense.rb
class Expense < ApplicationRecord
  belongs_to :account
  belongs_to :user
  belongs_to :category, optional: true
  belongs_to :store, optional: true
  belongs_to :user_store, optional: true
  belongs_to :user

  validates :amount, presence: true, numericality: true
  validates :sub_category, presence: true
  validates :date, presence: true

  before_save :set_next_occurrence, if: :recurring?

  def recurring?
    recurring
  end

  private

  def set_next_occurrence
    return unless next_occurrence.nil? || next_occurrence < Date.today

    self.next_occurrence = calculate_next_occurrence
  end

  def calculate_next_occurrence
    case frequency
    when 'daily'
      Date.today + 1.day
    when 'weekly'
      Date.today + (custom_frequency || 1).weeks
    when 'monthly'
      Date.today + (custom_frequency || 1).months
    when 'yearly'
      Date.today + (custom_frequency || 1).years
    else
      calculate_custom_frequency
    end
  end

  def calculate_custom_frequency
    case frequency_unit
    when 'week'
      Date.today + (custom_frequency || 1).weeks
    when 'month'
      if day_of_month
        next_month = Date.today.next_month(custom_frequency || 1)
        Date.new(next_month.year, next_month.month, day_of_month)
      else
        Date.today + (custom_frequency || 1).months
      end
    when 'year'
      Date.today + (custom_frequency || 1).years
    when 'day_of_week'
      next_day_of_week
    else
      Date.today
    end
  end

  def next_day_of_week
    current_date = Date.today
    current_day = current_date.wday
    target_day = day_of_week || 1
    delta = target_day - current_day
    delta += 7 if delta <= 0
    current_date + delta.days
  end
end
