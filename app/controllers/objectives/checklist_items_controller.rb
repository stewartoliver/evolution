module Objectives
  class ChecklistItemsController < ApplicationController
    before_action :set_checklist
    before_action :set_checklist_item, only: [:update, :destroy]

    def create
      @checklist_item = @checklist.checklist_items.build(checklist_item_params)

      respond_to do |format|
        if @checklist_item.save
          format.html { redirect_to @checklist.task, notice: 'Checklist item was successfully created.' }
          format.json { render json: @checklist_item, status: :created }
        else
          format.html { redirect_to @checklist.task, alert: 'Failed to create checklist item.' }
          format.json { render json: { errors: @checklist_item.errors }, status: :unprocessable_entity }
        end
      end
    rescue StandardError => e
      Rails.logger.error("Error in ChecklistItemsController#create: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      respond_to do |format|
        format.html { redirect_to @checklist.task, alert: 'An error occurred while creating the checklist item.' }
        format.json { render json: { error: e.message }, status: :internal_server_error }
      end
    end

    def update
      @checklist_item = @checklist.checklist_items.find(params[:id])

      respond_to do |format|
        if @checklist_item.update(checklist_item_params)
          format.html { redirect_to @checklist.task, notice: 'Checklist item was successfully updated.' }
          format.json { render json: @checklist_item }
        else
          format.html { redirect_to @checklist.task, alert: 'Failed to update checklist item.' }
          format.json { render json: { errors: @checklist_item.errors }, status: :unprocessable_entity }
        end
      end
    rescue StandardError => e
      Rails.logger.error("Error in ChecklistItemsController#update: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      respond_to do |format|
        format.html { redirect_to @checklist.task, alert: 'An error occurred while updating the checklist item.' }
        format.json { render json: { error: e.message }, status: :internal_server_error }
      end
    end

    def destroy
      @checklist_item = @checklist.checklist_items.find(params[:id])
      @checklist_item.destroy

      respond_to do |format|
        format.html { redirect_to @checklist.task, notice: 'Checklist item was successfully deleted.' }
        format.json { head :no_content }
      end
    rescue StandardError => e
      Rails.logger.error("Error in ChecklistItemsController#destroy: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      respond_to do |format|
        format.html { redirect_to @checklist.task, alert: 'An error occurred while deleting the checklist item.' }
        format.json { render json: { error: e.message }, status: :internal_server_error }
      end
    end

    def reorder
      @checklist_item = @checklist.checklist_items.find(params[:id])
      @checklist_item.insert_at(params[:position].to_i)
      head :ok
    end

    private

    def set_checklist
      Rails.logger.info("Finding task #{params[:task_id]} for user #{current_user.id}")
      task = current_user.tasks.find(params[:task_id])
      Rails.logger.info("Found task #{task.id} with #{task.checklists.count} checklists")
      
      Rails.logger.info("Finding checklist #{params[:checklist_id]} for task #{task.id}")
      @checklist = task.checklists.find(params[:checklist_id])
      Rails.logger.info("Found checklist #{@checklist.id} with #{@checklist.checklist_items.count} items")
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error("Record not found: #{e.message}")
      respond_to do |format|
        format.html { redirect_to objectives_tasks_path, alert: 'Record not found.' }
        format.json { render json: { error: 'Record not found' }, status: :not_found }
      end
    rescue StandardError => e
      Rails.logger.error("Error in set_checklist: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      respond_to do |format|
        format.html { redirect_to objectives_tasks_path, alert: 'An error occurred.' }
        format.json { render json: { error: e.message }, status: :internal_server_error }
      end
    end

    def set_checklist_item
      @checklist_item = @checklist.checklist_items.find(params[:id])
    end

    def checklist_item_params
      params.require(:checklist_item).permit(:text, :completed, :position)
    end
  end
end 