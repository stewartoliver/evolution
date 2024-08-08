module Objectives
  class DashboardController < ApplicationController
    before_action :authenticate_user!

    def index
      @overview_goals = current_user.goals.where(completed_at: nil).order(created_at: :desc).limit(3)
      @overview_tasks = current_user.tasks.where.not(status: 2).order(created_at: :desc).limit(5)
    end

  end
end