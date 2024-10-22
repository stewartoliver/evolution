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
    params.require(:user).permit(:email, :first_name, :last_name, :date_of_birth, :height, :gender, :activity_level, :current_weight, :goal_weight, :current_calorie_intake, :target_calorie_intake, :preferred_units)
  end

  # Log weight change if current_weight has changed
  def log_weight_change(user)
    if user.previous_changes.key?("current_weight")
      user.update_weight(user.current_weight)
    end
  end

  # Configure permitted parameters for Devise
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :date_of_birth, :height, :gender, :activity_level, :current_calorie_intake, :target_calorie_intake, :goal_weight, :preferred_units, :current_weight, :email])
  end
end
