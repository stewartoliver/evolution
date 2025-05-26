module Objectives
  class TasksController < ApplicationController
    before_action :set_task, only: [:show, :edit, :update, :destroy, :reorder]

    def filter_by_goal
      if params[:goal_id]
        @tasks = Task.where(goal_id: params[:goal_id])
      else
        @tasks = Task.all
      end
      render json: @tasks
    end

    def index
      @tasks = current_user.tasks.root_tasks.ordered
      respond_to do |format|
        format.html
        format.json { render json: @tasks }
      end
    end

    def show
      respond_to do |format|
        format.html
        format.json { 
          render json: @task.as_json(
            include: {
              checklists: {
                include: {
                  checklist_items: {
                    only: [:id, :text, :completed, :position]
                  }
                },
                only: [:id, :title]
              }
            }
          )
        }
      end
    rescue StandardError => e
      Rails.logger.error("Error in TasksController#show: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      render json: { error: e.message }, status: :internal_server_error
    end

    def edit
      respond_to do |format|
        format.html
        format.json { render json: @task }
      end
    end

    def create
      @task = current_user.tasks.build(task_params)
      if @task.save
        respond_to do |format|
          format.html { redirect_to objectives_task_path(@task), notice: 'Task was successfully created.' }
          format.json { render json: @task, status: :created }
        end
      else
        respond_to do |format|
          format.html { render :new }
          format.json { render json: { errors: @task.errors }, status: :unprocessable_entity }
        end
      end
    end

    def update
      if @task.update(task_params)
        respond_to do |format|
          format.html { redirect_to objectives_task_path(@task), notice: 'Task was successfully updated.' }
          format.json { render json: @task }
        end
      else
        respond_to do |format|
          format.html { render :edit }
          format.json { render json: { errors: @task.errors }, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @task.destroy
      respond_to do |format|
        format.html { redirect_to objectives_tasks_path, notice: 'Task was successfully deleted.' }
        format.json { head :no_content }
      end
    end

    def reorder
      @task.insert_at(params[:position].to_i)
      head :ok
    end

    private

    def set_task
      @task = current_user.tasks.includes(checklists: :checklist_items).find(params[:id])
      Rails.logger.info("Loaded task #{@task.id} with #{@task.checklists.count} checklists")
      @task.checklists.each do |checklist|
        Rails.logger.info("Checklist #{checklist.id} has #{checklist.checklist_items.count} items")
      end
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error("Task not found: #{e.message}")
      render json: { error: 'Task not found' }, status: :not_found
    rescue StandardError => e
      Rails.logger.error("Error in set_task: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      render json: { error: e.message }, status: :internal_server_error
    end

    def task_params
      params.require(:task).permit(
        :status, :title, :description, :due_date, :goal_id, 
        :priority, :assigned_to, :estimated_time, :actual_time, 
        :tags, :is_recurring, :recurrence_interval, :parent_task_id,
        checklists_attributes: [
          :id, :title, :_destroy,
          checklist_items_attributes: [:id, :text, :completed, :position, :_destroy]
        ],
        subtasks_attributes: [:id, :title, :description, :status, :due_date, :position, :_destroy]
      )
    end
  end
end
