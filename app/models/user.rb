class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable

  # Associations
  has_many :accounts
  has_many :budgets
  has_many :transactions
  has_many :bank_statement_imports, dependent: :destroy
  has_many :user_stores
  has_many :stores, through: :user_stores
  has_many :expenses
  has_many :routines
  has_many :fitness_log_entries
  has_many :habits, dependent: :destroy
  has_many :goals
  has_many :tasks, through: :goals
  has_many :achievements, through: :goals
  has_many :user_weight_histories, dependent: :destroy
  has_many :chores

  # Validations
  validates :workout_days_per_week, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 7 }, allow_nil: true
  validates :fitness_level, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true
  validates :savings_target_percentage, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }, allow_nil: true
  validates :monthly_budget_target, numericality: { greater_than: 0 }, allow_nil: true
  validates :blood_type, inclusion: { in: %w[A+ A- B+ B- O+ O- AB+ AB-], allow_nil: true }
  validates :language_preference, inclusion: { in: %w[en es fr de it pt ru zh ja ko], allow_nil: true }
  validates :activity_level, inclusion: { in: 0..3, allow_nil: true }

  # Callbacks
  before_save :update_calculated_fields
  before_save :normalize_medical_info

  # Constants
  ACTIVITY_LEVELS = {
    0 => "Sedentary",
    1 => "Lightly Active",
    2 => "Active",
    3 => "Very Active"
  }.freeze

  FITNESS_LEVELS = {
    0 => "Beginner",
    1 => "Intermediate",
    2 => "Advanced",
    3 => "Expert",
    4 => "Professional",
    5 => "Elite"
  }.freeze

  # Methods

  def update_weight(new_weight)
    user_weight_histories.create!(weight: new_weight, recorded_at: Time.current)
  end

  def weight_change_this_month
    # Get the first and the most recent weight logs for the current month
    first_weight = user_weight_histories.where('recorded_at >= ?', Time.current.beginning_of_month).order(:recorded_at).first
    last_weight = user_weight_histories.where('recorded_at >= ?', Time.current.beginning_of_month).order(:recorded_at).last

    # Ensure both first and last weights are present
    return "No weight logs for this month" if first_weight.nil? || last_weight.nil?

    # Calculate the weight difference
    weight_diff = last_weight.weight - first_weight.weight

    # Return the result as a string
    if weight_diff.zero?
      "No weight change this month"
    elsif weight_diff.positive?
      "+#{weight_diff.round(1)}kg this month"
    else
      "#{weight_diff.round(1)}kg this month"
    end
  end

  def calorie_intake_status
    return "Caloric data unavailable" if daily_caloric_needs.nil? || target_calorie_intake.nil? || current_calorie_intake.nil?

    if current_calorie_intake < daily_caloric_needs
      status = "Below Daily Caloric Needs"
    elsif current_calorie_intake > daily_caloric_needs
      status = "Above Daily Caloric Needs"
    else
      status = "Meeting Daily Caloric Needs"
    end

    if current_calorie_intake < target_calorie_intake
      target_status = "Below Target Caloric Intake"
    elsif current_calorie_intake > target_calorie_intake
      target_status = "Above Target Caloric Intake"
    else
      target_status = "Meeting Target Caloric Intake"
    end

    {
      daily_status: status,
      target_status: target_status,
      summary: "#{status} and #{target_status}"
    }
  end

  def measurement_unit
    preferred_units == 'imperial' ? 'in' : 'cm'
  end

  def weight_unit
    preferred_units == 'imperial' ? 'lb' : 'kg'
  end

  # Calculate the user's age based on date_of_birth
  def age
    return nil if date_of_birth.nil?

    ((Time.zone.now - date_of_birth.to_time) / 1.year.seconds).floor
  end

  # Calculate the user's Body Mass Index (BMI)
  def calculate_bmi
    return nil if height.nil? || current_weight.nil?

    if preferred_units == 'imperial'
      (current_weight / height ** 2 * 703).round(2) # Using the formula for BMI in imperial units
    else
      (current_weight / (height / 100.0) ** 2).round(2) # Using the formula for BMI in metric units
    end
  end

  def bmi_status
    bmi_value = calculate_bmi
    return "Invalid BMI" if bmi_value.nil?

    case bmi_value
    when 0..18.4
      "Underweight"
    when 18.5..24.9
      "Healthy weight"
    when 25..29.9
      "Overweight"
    when 30..Float::INFINITY
      "Obesity"
    else
      "Invalid BMI"
    end
  end

  # Calculate the user's Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
  def calculate_bmr
    return nil if height.nil? || current_weight.nil? || date_of_birth.nil? || gender.nil?

    weight_in_kg = preferred_units == 'imperial' ? current_weight * 0.453592 : current_weight
    height_in_cm = preferred_units == 'imperial' ? height * 2.54 : height

    if gender == 'male'
      (10 * weight_in_kg + 6.25 * height_in_cm - 5 * age + 5).round(2)
    else
      (10 * weight_in_kg + 6.25 * height_in_cm - 5 * age - 161).round(2)
    end
  end

  # Calculate an estimated average BMR based on general population data
  def calculate_average_bmr
    case age
    when 18..30
      gender == 'male' ? 1800 : 1500
    when 31..50
      gender == 'male' ? 1700 : 1400
    when 51..70
      gender == 'male' ? 1600 : 1300
    else
      gender == 'male' ? 1500 : 1200
    end
  end

  # Determine BMR status compared to average BMR
  def bmr_status
    bmr_value = calculate_bmr
    average_bmr_value = calculate_average_bmr
    return "Invalid BMR" if bmr_value.nil? || average_bmr_value.nil?

    if bmr_value < average_bmr_value * 0.9
      "Below Average BMR"
    elsif bmr_value > average_bmr_value * 1.1
      "Above Average BMR"
    else
      "Average BMR"
    end
  end

  # Calculate the daily caloric needs based on BMR and activity level
  def calculate_daily_caloric_needs
    bmr_value = calculate_bmr
    return nil if bmr_value.nil?

    multiplier = case activity_level
                 when 0 then 1.2   # Sedentary
                 when 1 then 1.375 # Lightly Active
                 when 2 then 1.55  # Active
                 when 3 then 1.725 # Very Active
                 else 1.2
                 end

    (bmr_value * multiplier).round(2)
  end

  # Method to update all calculated fields before saving the user
  def update_calculated_fields
    self.bmi = calculate_bmi
    self.bmr = calculate_bmr
    self.daily_caloric_needs = calculate_daily_caloric_needs
  end

  # Determine if the user is on track with their weight goal
  def on_track_with_goal?
    return nil if current_weight.nil? || goal_weight.nil?

    # Assuming 'on track' means within 5% of goal weight
    (current_weight - goal_weight).abs <= (goal_weight * 0.05)
  end

  # Full name method
  def full_name
    "#{first_name} #{last_name}".strip
  end

  def current_streak
    return 0 if fitness_log_entries.empty?

    # Get all unique dates with workouts, ordered by date descending
    workout_dates = fitness_log_entries.select(:date).distinct.order(date: :desc).pluck(:date)
    return 0 if workout_dates.empty?

    streak = 0
    current_date = Time.current.to_date

    # If the most recent workout was more than 1 day ago, streak is broken
    return 0 if (current_date - workout_dates.first).to_i > 1

    # Count consecutive days
    workout_dates.each_with_index do |date, index|
      if index == 0
        # First date should be today or yesterday
        if (current_date - date).to_i <= 1
          streak += 1
        else
          break
        end
      else
        # Check if this date is consecutive with the previous date
        if (workout_dates[index - 1] - date).to_i == 1
          streak += 1
        else
          break
        end
      end
    end

    streak
  end

  # New methods for profile management

  def fitness_level_name
    FITNESS_LEVELS[fitness_level] || "Not specified"
  end

  def workout_schedule
    return "Not specified" if workout_days_per_week.nil?
    "#{workout_days_per_week} days per week#{preferred_workout_time ? " at #{preferred_workout_time}" : ''}"
  end

  def health_summary
    conditions = []
    conditions << "Medical Conditions: #{medical_conditions}" if medical_conditions.present?
    conditions << "Allergies: #{allergies}" if allergies.present?
    conditions << "Medications: #{medications}" if medications.present?
    conditions << "Blood Type: #{blood_type}" if blood_type.present?
    conditions << "Injury Restrictions: #{injury_restrictions}" if injury_restrictions.present?
    
    conditions.empty? ? "No health information specified" : conditions.join("\n")
  end

  def emergency_contact_info
    return "No emergency contact specified" unless emergency_contact_name.present?
    "#{emergency_contact_name} (#{emergency_contact_phone})"
  end

  def financial_summary
    conditions = []
    conditions << "Monthly Budget Target: #{default_currency} #{monthly_budget_target}" if monthly_budget_target.present?
    conditions << "Savings Target: #{savings_target_percentage}%" if savings_target_percentage.present?
    conditions << "Primary Financial Goal: #{primary_financial_goal}" if primary_financial_goal.present?
    
    conditions.empty? ? "No financial goals specified" : conditions.join("\n")
  end

  private

  def normalize_medical_info
    self.medical_conditions = medical_conditions&.strip
    self.allergies = allergies&.strip
    self.medications = medications&.strip
    self.injury_restrictions = injury_restrictions&.strip
  end
end
