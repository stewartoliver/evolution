class Objectives::ChoreLogsController < ApplicationController
  def create
    @chore_log = ChoreLog.new(chore_log_params)
    @chore_log.user = current_user

    if @chore_log.save
      # Update the chore's next_due_at based on its repeat rule
      chore = @chore_log.chore
      chore.update_next_due_date
      
      # Return a success response for AJAX
      respond_to do |format|
        format.html { redirect_to objectives_dashboard_path, notice: 'Chore completed!' }
        format.json { render json: { success: true } }
      end
    else
      respond_to do |format|
        format.html { redirect_to objectives_dashboard_path, alert: 'Failed to complete chore.' }
        format.json { render json: { success: false, errors: @chore_log.errors }, status: :unprocessable_entity }
      end
    end
  end

  private

  def chore_log_params
    params.require(:chore_log).permit(:chore_id, :completed_at, :notes, :was_skipped)
  end
end 