module Objectives
  class GoalsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_goal, only: [:show, :edit, :update, :make_task]


    def dashboard
      @goals = Goal.all
    end

    def index
      @goals = Goal.all
    end

    def edit

    end

    def update
      if @goal.update(goal_params)
        redirect_to objectives_goal_path(@goal), notice: 'Goal was successfully updated.'
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
        redirect_to objectives_goals_path, notice: 'Goal was successfully created.'
      else
        render :new
      end
    end

    def make_task
      @task = @goal.tasks.build(task_params)
      if @task.save
        redirect_to objectives_goal_path(@goal), notice: 'Task was successfully added.'
      else
        redirect_to objectives_goal_path(@goal), notice: 'Task failed to be added. Please try again.'
      end
    end

    private
    def set_goal
      @goal = Goal.find(params[:id])
    end

    def goal_params
      params.require(:goal).permit(:title, :description, :start_date, :end_date)
    end

    def task_params
      params.require(:task).permit(:title, :description, :due_date)
    end
  end
end
