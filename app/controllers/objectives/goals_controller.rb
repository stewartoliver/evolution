module Objectives
  class GoalsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_goal, only: [:show, :edit, :update, :make_task, :complete, :new_child, :create_child]

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
      @task.user_id = current_user.id
      if @task.save
        render json: @task, status: :created
      else
        render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def complete
      if @goal.complete!
        redirect_back fallback_location: objectives_goal_path(@goal), notice: 'Goal was successfully completed.'
      else
        redirect_back fallback_location: objectives_goal_path(@goal), alert: 'Failed to complete the goal. Please try again.'
      end
    end

    def new_child
      @child_goal = @goal.sub_goals.new
    end

    def create_child
      @child_goal = @goal.sub_goals.build(child_goal_params.merge(user: current_user, parent_goal: @goal, generation: @goal.generation + 1))

      if @child_goal.save
        redirect_to objectives_goal_path(@child_goal), notice: 'Child goal was successfully created.'
      else
        render :new_child
      end
    end

    private
    def set_goal
      @goal = Goal.find(params[:id])
    end

    def goal_params
      params.require(:goal).permit(:title, :description, :start_date, :end_date, :status)
    end

    def task_params
      params.require(:task).permit(:title, :status, :description, :due_date)
    end

    def child_goal_params
      params.require(:goal).permit(:title, :description)
    end
  end
end
