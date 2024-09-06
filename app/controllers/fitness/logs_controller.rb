module Fitness
  class LogsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_log, only: [:update, :show, :destroy]

    def index
      @logs = FitnessLogEntry.all
    end

    def new
      @log = FitnessLogEntry.new
    end

    def create
      @log = current_user.fitness_log_entries.build(log_params)
      if @log.save
        redirect_to fitness_log_path(@log), notice: 'Log entry was successfully created.'
      else
        Rails.logger.debug(@log.errors.full_messages.to_sentence)
        render :new
      end
    end

    def edit
      @log = FitnessLogEntry.includes(fitness_log_exercises: :fitness_log_sets).find(params[:id])
    end

    def update
      if @log.update(log_params)
        redirect_to fitness_log_path(@log), notice: 'Log entry was successfully updated.'
      else
        render :edit
      end
    end

    def show
    end

    def destroy
      @log.destroy
      redirect_to fitness_logs_path, notice: 'Log entry was successfully deleted.'
    end

    private

    def set_log
      @log = FitnessLogEntry.find(params[:id])
    end

    def log_params
      params.require(:fitness_log_entry).permit(:date, :time, :notes, fitness_log_exercises_attributes: [:id, :exercise_id, :_destroy, fitness_log_sets_attributes: [:id, :reps, :weight, :duration, :distance, :intensity, :style, :_destroy]])
    end
  end
end
