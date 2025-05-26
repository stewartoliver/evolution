class Expense < ApplicationRecord
  belongs_to :account
  belongs_to :user
  belongs_to :category, optional: true
  belongs_to :financial_store, optional: true
  belongs_to :user_store, optional: true
  has_many :expense_payments, dependent: :destroy
  
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
    return nil unless recurring?
  
    reference_date = date.to_date
    return nil if end_date.present? && reference_date > end_date
  
    next_occurrence = case frequency_unit
    when 'day'
      reference_date + (custom_frequency || 1).days
    when 'week'
      calculate_next_weekly_occurrence(reference_date)
    when 'month'
      calculate_next_monthly_occurrence(reference_date)
    when 'year'
      calculate_next_yearly_occurrence(reference_date)
    else
      reference_date
    end
  
    # Ensure next occurrence is within the valid range
    next_occurrence = [next_occurrence, end_date].compact.min
  
    # If next occurrence is still in the past, move to the next cycle
    while next_occurrence < Date.today
      next_occurrence = calculate_next_occurrence_after(next_occurrence)
      break if end_date.present? && next_occurrence > end_date
    end
  
    next_occurrence
  end
  
  def related_transactions
    Transaction.where(
      user_id: user_id,
      account_id: account_id,
      category_id: category_id,
      amount: -amount  # Negative because expenses are positive amounts but transactions are negative
    ).where(
      "date >= ? AND date <= ?", 
      date, 
      end_date || Date.today
    ).order(date: :desc)
  end

  # New methods for expected transactions
  def expected_transactions
    return [] unless recurring?
    
    transactions = []
    current_date = date
    
    # Skip the start date if it's in the past and has a transaction
    if current_date < Date.today && transaction_exists_for_date?(current_date)
      current_date = calculate_next_occurrence_after(current_date)
    end
    
    while current_date.present? && current_date <= (end_date || Date.today + 1.year)
      # Skip dates that already have transactions
      unless transaction_exists_for_date?(current_date)
        transactions << current_date
      end
      
      # Calculate next date
      next_date = calculate_next_occurrence_after(current_date)
      
      # Break if we've reached the end date or if next_date is nil
      break if next_date.nil? || (end_date.present? && next_date > end_date)
      
      current_date = next_date
    end
    
    transactions
  end
  
  def transaction_exists_for_date?(date)
    related_transactions.where.not(transaction_type: 'Failed Payment').exists?(date: date)
  end

  def payment_status_for_date(date)
    if transaction_exists_for_date?(date)
      'paid'
    elsif expense_payments.exists?(date: date)
      'paid'
    else
      'unpaid'
    end
  end

  def mark_as_paid(date, user)
    expense_payments.create!(date: date, user: user)
  end

  def unmark_as_paid(date)
    expense_payments.where(date: date).destroy_all
  end

  def verify_payment(date, transaction)
    payment = expense_payments.find_by(date: date)
    return unless payment

    payment.update!(
      verified: true,
      verified_at: Time.current,
      transaction: transaction
    )
  end
  
  private

  def calculate_next_occurrence_after(reference_date)
    return nil unless recurring?
    return nil if end_date.present? && reference_date > end_date
  
    case frequency
    when 'daily'
      reference_date + 1.day
    when 'weekly'
      reference_date + 1.week
    when 'monthly'
      calculate_next_monthly_occurrence(reference_date)
    when 'yearly'
      calculate_next_yearly_occurrence(reference_date)
    when 'custom'
      case frequency_unit
      when 'day'
        reference_date + custom_frequency.days
      when 'week'
        if day_of_week.present?
          # Find the next occurrence of this day of week
          days_to_add = (day_of_week - reference_date.wday) % 7
          # If days_to_add is 0 and we're not at the start of a cycle, add a full week
          days_to_add = 7 if days_to_add == 0 && reference_date.wday != day_of_week
          target_date = reference_date + days_to_add.days
          # Then add the required number of weeks
          target_date + (custom_frequency - 1).weeks
        else
          reference_date + custom_frequency.weeks
        end
      when 'month'
        next_months = reference_date.next_month(custom_frequency)
        target_day = day_of_month || reference_date.day
        last_day_of_month = Date.new(next_months.year, next_months.month, -1).day
        adjusted_day = [target_day, last_day_of_month].min
        Date.new(next_months.year, next_months.month, adjusted_day)
      when 'year'
        next_years = reference_date.next_year(custom_frequency)
        target_day = reference_date.day
        last_day_of_month = Date.new(next_years.year, next_years.month, -1).day
        adjusted_day = [target_day, last_day_of_month].min
        Date.new(next_years.year, next_years.month, adjusted_day)
      else
        reference_date
      end
    else
      reference_date
    end
  end
  
  def calculate_next_daily_occurrence(reference_date)
    # Calculate how many days have passed since the reference date
    days_passed = (Date.today - reference_date).to_i
    frequency_days = custom_frequency || 1
    
    # Calculate how many periods have passed and what the next period would be
    periods_passed = (days_passed / frequency_days.to_f).ceil
    next_date = reference_date + (periods_passed * frequency_days).days
    
    # Check if this would exceed the end_date
    return nil if end_date.present? && next_date > end_date
    
    next_date
  end
  
  def calculate_next_weekly_occurrence(reference_date)
    # Ensure reference_date is a Date object
    reference_date = reference_date.to_date if reference_date.respond_to?(:to_date)
    
    # Calculate how many weeks have passed since the reference date
    days_difference = (Date.today - reference_date).to_i
    weeks_passed = (days_difference / 7.0).ceil
    frequency_weeks = (custom_frequency.presence || 1).to_i
    
    # Calculate how many periods have passed and what the next period would be
    periods_passed = (weeks_passed / frequency_weeks.to_f).ceil
    next_date = reference_date + (periods_passed * frequency_weeks).weeks
    
    # Check if this would exceed the end_date
    return nil if end_date.present? && next_date > end_date
    
    next_date
  end
  
  def calculate_next_monthly_occurrence(reference_date)
    target_day = day_of_month || reference_date.day
    months_passed = ((Date.today.year - reference_date.year) * 12 + (Date.today.month - reference_date.month)).ceil
    months_to_add = (months_passed / (custom_frequency || 1)).ceil * (custom_frequency || 1)
  
    next_month = reference_date.next_month(months_to_add) # Use next_month instead of >>
    last_day_of_month = Date.new(next_month.year, next_month.month, -1).day
    adjusted_day = [target_day, last_day_of_month].min
  
    next_date = Date.new(next_month.year, next_month.month, adjusted_day)
    
    # Check if this would exceed the end_date
    return nil if end_date.present? && next_date > end_date
    
    next_date
  end  
  
  def calculate_next_yearly_occurrence(reference_date)
    target_day = reference_date.day
    target_month = reference_date.month
    years_passed = (Date.today.year - reference_date.year).ceil
    years_to_add = (years_passed / (custom_frequency || 1)).ceil * (custom_frequency || 1)
  
    next_year = reference_date.year + years_to_add
    last_day_of_month = Date.new(next_year, target_month, -1).day
    adjusted_day = [target_day, last_day_of_month].min
  
    next_date = Date.new(next_year, target_month, adjusted_day)
    
    # Check if this would exceed the end_date
    return nil if end_date.present? && next_date > end_date
    
    next_date
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