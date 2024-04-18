module Fitness
  class DashboardController < ApplicationController
    before_action :authenticate_user!

    def index
      @logs_this_week = FitnessLogEntry.entries_this_week(current_user)
    end
  end
end
