module Goals
  class GoalsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_goal, only: [:show, :edit, :update]


    def dashboard
      @goals = Goal.all
    end

    def index
      @goals = Goal.all
    end

    def edit

    end

    def update
      if @goal.save
        redirect_to goals_goals_path, notice: 'Goal was successfully updated.'
      else
        render :edit
      end
    end

    def show

    end

    def new
      @goal = Goal.new
    end

    def create
      @goal = current_user.goals.build(goal_params)
      if @goal.save
        redirect_to goals_goals_path, notice: 'Goal was successfully created.'
      else
        render :new
      end
    end

    private
    def set_goal
      @goal = Goal.find(params[:id])
    end

    def goal_params
      params.require(:goal).permit(:title, :description, :start_date, :end_date, :notes)
    end
  end
end
