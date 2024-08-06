module Objectives
  class TasksController < ApplicationController
    def filter_by_goal
      if params[:goal_id]
        @tasks = Task.where(goal_id: params[:goal_id])
      else
        @tasks = Task.all
      end
      render json: @tasks
    end

    def index
      @tasks = current_user.tasks
    end

    def create
      @task = Task.new(task_params)
      if @task.save
        render json: @task
      else
        render json: @task.errors, status: :unprocessable_entity
      end
    end

    def update
      @task = Task.find(params[:id])
      if @task.update(task_params)
        render json: @task
      else
        render json: @task.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @task = Task.find(params[:id])
      @task.destroy
      head :no_content
    end

    def show
      @task = Task.find(params[:id])
    end

    private

    def task_params
      params.require(:task).permit(:status, :title, :description, :due_date, :goal_id)
    end
  end
end
