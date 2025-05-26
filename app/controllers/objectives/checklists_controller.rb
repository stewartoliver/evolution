module Objectives
  class ChecklistsController < ApplicationController
    before_action :set_task
    before_action :set_checklist, only: [:update, :destroy]

    def create
      @checklist = @task.checklists.build(checklist_params)

      respond_to do |format|
        if @checklist.save
          format.html { redirect_to @task, notice: 'Checklist was successfully created.' }
          format.json { render json: @checklist.as_json(include: { checklist_items: { only: [:id, :text, :completed, :position] } }), status: :created }
        else
          format.html { redirect_to @task, alert: 'Failed to create checklist.' }
          format.json { render json: { errors: @checklist.errors }, status: :unprocessable_entity }
        end
      end
    rescue StandardError => e
      respond_to do |format|
        format.html { redirect_to @task, alert: 'An error occurred while creating the checklist.' }
        format.json { render json: { error: e.message }, status: :internal_server_error }
      end
    end

    def update
      respond_to do |format|
        if @checklist.update(checklist_params)
          format.html { redirect_to @task, notice: 'Checklist was successfully updated.' }
          format.json { render json: @checklist.as_json(include: { checklist_items: { only: [:id, :text, :completed, :position] } }) }
        else
          format.html { redirect_to @task, alert: 'Failed to update checklist.' }
          format.json { render json: { errors: @checklist.errors }, status: :unprocessable_entity }
        end
      end
    rescue StandardError => e
      respond_to do |format|
        format.html { redirect_to @task, alert: 'An error occurred while updating the checklist.' }
        format.json { render json: { error: e.message }, status: :internal_server_error }
      end
    end

    def destroy
      @checklist.destroy
      respond_to do |format|
        format.html { redirect_to @task, notice: 'Checklist was successfully deleted.' }
        format.json { head :no_content }
      end
    rescue StandardError => e
      respond_to do |format|
        format.html { redirect_to @task, alert: 'An error occurred while deleting the checklist.' }
        format.json { render json: { error: e.message }, status: :internal_server_error }
      end
    end

    private

    def set_task
      @task = current_user.tasks.find(params[:task_id])
    rescue ActiveRecord::RecordNotFound
      respond_to do |format|
        format.html { redirect_to objectives_tasks_path, alert: 'Task not found.' }
        format.json { render json: { error: 'Task not found' }, status: :not_found }
      end
    end

    def set_checklist
      @checklist = @task.checklists.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      respond_to do |format|
        format.html { redirect_to @task, alert: 'Checklist not found.' }
        format.json { render json: { error: 'Checklist not found' }, status: :not_found }
      end
    end

    def checklist_params
      params.require(:checklist).permit(:title)
    end
  end
end 