# app/controllers/api/v1/tasks_controller.rb

module Api
  module V1
    class TasksController < ApplicationController
      def completed_per_day
        start_of_month = Date.today.beginning_of_month
        end_of_month = Date.today.end_of_month

        tasks_per_day = Task.completed
                            .where(completed_at: start_of_month..end_of_month)
                            .group("DATE(completed_at)")
                            .count

        tasks_data = (start_of_month..end_of_month).map do |date|
          { date: date, count: tasks_per_day[date] || 0 }
        end

        render json: tasks_data
      end
    end
  end
end
