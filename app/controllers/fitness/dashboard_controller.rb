module Fitness
  class DashboardController < ApplicationController
    before_action :authenticate_user!

    def index
      @logs_this_week = FitnessLogEntry.entries_this_week(current_user)
    end

    def logs_this_week_chart
      @logs_this_week = FitnessLogEntry.entries_this_week(current_user).group_by_day(:date).count
    end
  end
end
