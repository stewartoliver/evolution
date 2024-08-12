# frozen_string_literal: true

class Users::UserWeightHistoriesController < Devise::PasswordsController
  before_action :authenticate_user!
  before_action :set_user

  def index
    @user_weight_histories = @user.user_weight_histories
  end

  # Other actions like new, create, edit, update, destroy

  private

  def set_user
    @user = current_user
  end
end
