module Operator
  class DashboardController < ApplicationController
    before_action :authenticate_user!
    before_action :check_operator

    def index
      # Your admin dashboard action
    end

    private

    def check_operator
      redirect_to root_path, alert: 'You are not authorized to access this page.' unless current_user.operator?
    end
  end
end
