class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_account_update_params, only: [:update]

  def show
    @user = current_user
  end

  protected

  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [
      :first_name, :last_name, :date_of_birth, :height, :gender, 
      :activity_level, :current_calorie_intake, :target_calorie_intake, 
      :goal_weight, :preferred_units, :current_weight, :operator, :email
    ])
  end
end
