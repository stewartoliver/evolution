module Objectives
  class DashboardController < ApplicationController
    before_action :authenticate_user!

    def index
      add_breadcrumb 'Objectives', objectives_dashboard_path
      add_breadcrumb 'Dashboard'
      
      # @overview_goals = current_user.goals.where(completed_at: nil).order(created_at: :desc).limit(3)
      @favourite_goals = current_user.goals.where(completed_at: nil, is_favourite: true).order(created_at: :desc).limit(3)
      @overview_tasks = current_user.tasks.where.not(status: 2).order(created_at: :desc).limit(5)
      @overview_habits = current_user.habits.limit(2)
      @upcoming_chores = current_user.chores.upcoming
    end

  end
end