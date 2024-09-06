module Objectives
  class HabitLogsController < ApplicationController
    before_action :set_habit, only: [:create]

    def create
      today_log = @habit.habit_logs.find_or_initialize_by(date: Date.today)
      today_log.occurrences = habit_log_params[:occurrences]

      if today_log.save
        render json: today_log, status: :created
      else
        Rails.logger.error("Params received: #{params.inspect}")
        Rails.logger.error("Validation errors: #{today_log.errors.full_messages}")
        render json: { errors: today_log.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_habit
      @habit = current_user.habits.find(params[:habit_id])
    end

    def habit_log_params
      params.require(:habit_log).permit(:occurrences)
    end
  end
end