class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable

  # Associations
  has_many :accounts
  has_many :transactions
  has_many :user_stores
  has_many :stores, through: :user_stores
  has_many :expenses
  has_many :routines
  has_many :fitness_log_entries
  has_many :goals
  has_many :tasks, through: :goals
  has_many :achievements, through: :goals
  has_many :user_weight_histories, dependent: :destroy

  # Callbacks
  before_save :update_calculated_fields

  # Methods

  # Updates the current weight and logs the change in user_weight_histories
  def update_weight(new_weight, note = nil)
    transaction do
      update!(current_weight: new_weight)
      user_weight_histories.create!(weight: new_weight, recorded_at: Time.current, note: note)
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
    preferred_units == 'imperial' ? 'lbs' : 'kgs'
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
end
