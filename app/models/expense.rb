class Expense < ApplicationRecord
  belongs_to :account
  belongs_to :user
  belongs_to :category, optional: true
  belongs_to :financial_store, optional: true
  belongs_to :user_store, optional: true
  
  validates :amount, presence: true, numericality: true
  validates :sub_category, presence: true
  validates :date, presence: true
  
  # Add validations for recurring expenses
  validates :frequency, presence: true, if: :recurring?
  validates :day_of_week, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than: 7 }, if: -> { recurring? && (frequency == 'weekly' || (frequency == 'custom' && frequency_unit == 'week')) }
  validates :day_of_month, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 31 }, if: -> { recurring? && (frequency == 'monthly' || (frequency == 'custom' && frequency_unit == 'month')) }
  validates :custom_frequency, numericality: { only_integer: true, greater_than: 0 }, if: -> { recurring? && frequency == 'custom' }
  validates :frequency_unit, presence: true, if: -> { recurring? && frequency == 'custom' }
  
  before_save :set_next_occurrence, if: :recurring?
  after_update :recalculate_next_occurrence, if: -> { saved_change_to_date? || saved_change_to_frequency? || saved_change_to_frequency_unit? || saved_change_to_custom_frequency? || saved_change_to_day_of_month? || saved_change_to_day_of_week? }
  
  # Scopes
  scope :recurring, -> { where(recurring: true) }
  scope :upcoming, ->(days = 14) { where(next_occurrence: Date.today..days.days.from_now) }
  scope :recurring_upcoming, ->(days = 14) { recurring.upcoming(days) }
  scope :overdue, -> { where('next_occurrence < ?', Date.today) }
  
  def recurring?
    recurring
  end
  
  def overdue?
    recurring? && next_occurrence < Date.today
  end
  
  def days_until_next_payment
    return nil unless recurring?
    (next_occurrence - Date.today).to_i
  end
  
  def next_occurrence_after(date)
    return nil unless recurring?
    current_date = date
    while current_date < date
      current_date = calculate_next_occurrence_after(current_date)
    end
    current_date
  end
  
  def refresh_next_occurrence!
    update_column(:next_occurrence, calculate_next_occurrence)
  end
  
  def recalculate_next_occurrence
    self.next_occurrence = calculate_next_occurrence
    save(validate: false) if next_occurrence_changed?
  end
  
  def set_next_occurrence
    return unless next_occurrence.nil? || next_occurrence < Date.today
    self.next_occurrence = calculate_next_occurrence
  end
  
  def calculate_next_occurrence
    # Always use the initial date as the reference point
    reference_date = date
        
    # If the initial date is in the future, that's our next occurrence
    return reference_date if reference_date >= Date.today
    
    # Otherwise, calculate the appropriate next occurrence based on the initial date
    case frequency
    when 'daily'
      calculate_next_daily_occurrence(reference_date)
    when 'weekly'
      calculate_next_weekly_occurrence(reference_date)
    when 'monthly'
      calculate_next_monthly_occurrence(reference_date)
    when 'yearly'
      calculate_next_yearly_occurrence(reference_date)
    when 'custom'
      calculate_custom_frequency(reference_date)
    else
      reference_date
    end
  end
  
  private
  
  def calculate_next_daily_occurrence(reference_date)
    # Calculate how many days have passed since the reference date
    days_passed = (Date.today - reference_date).to_i
    frequency_days = custom_frequency || 1
    
    # Calculate how many periods have passed and what the next period would be
    periods_passed = (days_passed / frequency_days.to_f).ceil
    reference_date + (periods_passed * frequency_days).days
  end
  
  def calculate_next_weekly_occurrence(reference_date)
    # Calculate how many weeks have passed since the reference date
    weeks_passed = ((Date.today - reference_date).to_i / 7.0).ceil
    frequency_weeks = custom_frequency || 1
    
    # Calculate how many periods have passed and what the next period would be
    periods_passed = (weeks_passed / frequency_weeks.to_f).ceil
    reference_date + (periods_passed * frequency_weeks).weeks
  end
  
  def calculate_next_monthly_occurrence(reference_date)
    # Use the day of month from the original date
    target_day = day_of_month || reference_date.day
    
    # Calculate months passed since reference date
    months_passed = (Date.today.year - reference_date.year) * 12 + (Date.today.month - reference_date.month)
    frequency_months = custom_frequency || 1
    
    # Calculate periods passed and months to add to reference date
    periods_passed = (months_passed / frequency_months.to_f).ceil
    months_to_add = periods_passed * frequency_months
    
    # Calculate target month and year
    target_month = reference_date.month + months_to_add
    target_year = reference_date.year
    
    # Adjust year if month overflows
    while target_month > 12
      target_month -= 12
      target_year += 1
    end
    
    # Ensure the day exists in the target month
    last_day_of_month = Date.new(target_year, target_month, -1).day
    adjusted_day = [target_day, last_day_of_month].min
    
    result = Date.new(target_year, target_month, adjusted_day)
    
    # If the result is still in the past, add one more period
    if result < Date.today
      target_month += frequency_months
      while target_month > 12
        target_month -= 12
        target_year += 1
      end
      last_day_of_month = Date.new(target_year, target_month, -1).day
      adjusted_day = [target_day, last_day_of_month].min
      result = Date.new(target_year, target_month, adjusted_day)
    end
    
    result
  end
  
  def calculate_next_yearly_occurrence(reference_date)
    # How many years have passed since the reference date
    years_passed = Date.today.year - reference_date.year
    frequency_years = custom_frequency || 1
    
    # Calculate periods passed and years to add
    periods_passed = (years_passed / frequency_years.to_f).ceil
    years_to_add = periods_passed * frequency_years
    
    # Next occurrence date
    target_year = reference_date.year + years_to_add
    target_month = reference_date.month
    
    # Handle Feb 29 in non-leap years
    if reference_date.month == 2 && reference_date.day == 29 && !Date.leap?(target_year)
      target_day = 28
    else
      target_day = reference_date.day
    end
    
    result = Date.new(target_year, target_month, target_day)
    
    # If still in the past, add one more period
    if result < Date.today
      result = Date.new(target_year + frequency_years, target_month, target_day)
    end
    
    result
  end
  
  def calculate_custom_frequency(reference_date)
    case frequency_unit
    when 'day'
      calculate_next_daily_occurrence(reference_date)
    when 'week'
      if day_of_week.present?
        calculate_next_day_of_week(reference_date)
      else
        calculate_next_weekly_occurrence(reference_date)
      end
    when 'month'
      if day_of_month.present?
        calculate_next_specific_day_of_month(reference_date)
      else
        calculate_next_monthly_occurrence(reference_date)
      end
    when 'year'
      calculate_next_yearly_occurrence(reference_date)
    when 'day_of_week'
      calculate_next_day_of_week(reference_date)
    else
      Date.today
    end
  end
  
  def calculate_next_day_of_week(reference_date)
    target_day = day_of_week || reference_date.wday
    frequency_weeks = custom_frequency || 1
    
    # Get the day of the week for the reference date
    reference_wday = reference_date.wday
    
    # Calculate days since the reference date
    days_since_reference = (Date.today - reference_date).to_i
    
    # Calculate full weeks that have passed since reference date
    weeks_passed = days_since_reference / 7
    
    # Find which period we're in based on the custom frequency
    current_period = (weeks_passed / frequency_weeks.to_f).ceil
    
    # Calculate the start of the next period
    period_start = reference_date + (current_period * frequency_weeks).weeks
    
    # Find the target day within this period
    days_to_add = (target_day - period_start.wday) % 7
    next_occurrence = period_start + days_to_add.days
    
    # If the calculated date is in the past, move to the next period
    if next_occurrence < Date.today
      next_period_start = reference_date + ((current_period + 1) * frequency_weeks).weeks
      days_to_add = (target_day - next_period_start.wday) % 7
      next_occurrence = next_period_start + days_to_add.days
    end
    
    next_occurrence
  end
  
  def calculate_next_specific_day_of_month(reference_date)
    target_day = day_of_month
    
    # Calculate months passed since reference date
    months_passed = (Date.today.year - reference_date.year) * 12 + (Date.today.month - reference_date.month)
    frequency_months = custom_frequency || 1
    
    # Calculate periods passed and months to add
    periods_passed = (months_passed / frequency_months.to_f).ceil
    months_to_add = periods_passed * frequency_months
    
    # Calculate target month and year
    target_month = reference_date.month + months_to_add
    target_year = reference_date.year
    
    # Adjust year if month overflows
    while target_month > 12
      target_month -= 12
      target_year += 1
    end
    
    # Make sure the day exists in the month
    last_day_of_month = Date.new(target_year, target_month, -1).day
    adjusted_target_day = [target_day, last_day_of_month].min
    
    result = Date.new(target_year, target_month, adjusted_target_day)
    
    # If we're still in the past, move to the next period
    if result < Date.today
      target_month += frequency_months
      while target_month > 12
        target_month -= 12
        target_year += 1
      end
      last_day_of_month = Date.new(target_year, target_month, -1).day
      adjusted_target_day = [target_day, last_day_of_month].min
      result = Date.new(target_year, target_month, adjusted_target_day)
    end
    
    result
  end
end