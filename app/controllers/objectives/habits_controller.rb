module Objectives
  class HabitsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_habit, only: [:edit, :update, :show, :details, :today_occurrences]

    def index
      @habits = current_user.habits
    end

    def new
      @habit = current_user.habits.new
    end

    def create
      @habit = current_user.habits.new(habit_params)
      if @habit.save
        redirect_to objectives_habit_path(@habit), notice: 'Habit was successfully created.'
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @habit.update(habit_params)
        redirect_to objectives_habit_path(@habit), notice: 'Habit was successfully updated.'
      else
        render :edit
      end
    end

    def show
    end

    def today_occurrences
      today_logs = @habit.habit_logs.where(created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)
      total_occurrences = today_logs.sum(:occurrences)

      render json: { occurrences: total_occurrences }
    end

    def details
      render json: @habit
    end

    private

    def set_habit
      @habit = current_user.habits.find(params[:id])
    end

    def habit_params
      params.require(:habit).permit(:name, :description, :frequency, :target_occurrences, :goal_id, :task_id)
    end
  end
end
