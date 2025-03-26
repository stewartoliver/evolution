class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_account_update_params, only: [:update]

  def show
    @user = current_user
  end

  def update
    @user = current_user
    if @user.update(user_update_params)
      log_weight_change(@user)
      redirect_back(fallback_location: request.referer, notice: 'Profile updated successfully')
    else
      render :edit
    end
  end

  protected

  # Method to permit parameters for updating the user account, excluding passwords
  def user_update_params
    params.require(:user).permit(
      :email, :first_name, :last_name, :date_of_birth, :height, :gender, 
      :activity_level, :current_weight, :goal_weight, :current_calorie_intake, 
      :target_calorie_intake, :preferred_units, :current_weight,
      # Financial preferences
      :default_currency, :monthly_budget_target, :savings_target_percentage,
      # Fitness preferences
      :workout_days_per_week, :preferred_workout_time, :fitness_level, :injury_restrictions,
      # Health and wellness
      :medical_conditions, :allergies, :medications, :blood_type,
      :emergency_contact_name, :emergency_contact_phone,
      # Goals and preferences
      :primary_fitness_goal, :primary_financial_goal, :time_zone, :language_preference,
      notification_preferences: {}
    )
  end

  # Log weight change if current_weight has changed
  def log_weight_change(user)
    if user.previous_changes.key?("current_weight")
      user.update_weight(user.current_weight)
    end
  end

  # Configure permitted parameters for Devise
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: user_update_params.keys)
  end
end
