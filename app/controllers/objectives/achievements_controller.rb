module Objectives
  class AchievementsController < ApplicationController
    before_action :authenticate_user!

    def index
      
    end

    def edit

    end

    def update

    end

    def new

    end

    def create

    end

    def show

    end

    private
    def set_achievement
      @achievement = Achievement.find(params[:id])
    end

    def achievement_params
      params.require(:achievement).permit(:achieved_at, :description)
    end

  end
end