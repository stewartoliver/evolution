module Fitness
  class LogsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_log, only: [:edit, :update, :show, :destroy]

    def index
      @logs = current_user.fitness_log_entries.includes(fitness_log_exercises: :fitness_log_sets)
    end

    def new
      @log = current_user.fitness_log_entries.build
      @is_edit_page = false
      # Build an initial exercise and set for the form
      fitness_log_exercise = @log.fitness_log_exercises.build
      fitness_log_exercise.fitness_log_sets.build
    end

    def edit
      @is_edit_page = true
      # If you need to ensure at least one exercise and set, you can build them here if necessary
      if @log.fitness_log_exercises.empty?
        fitness_log_exercise = @log.fitness_log_exercises.build
        fitness_log_exercise.fitness_log_sets.build
      end
    end

    def create
      @log = current_user.fitness_log_entries.build(log_params)
      if @log.save
        redirect_to fitness_log_path(@log), notice: 'Log was successfully created.'
      else
        Rails.logger.debug(@log.errors.full_messages.to_sentence)
        @is_edit_page = false
        render :new
      end
    end

    def update
      if @log.update(log_params)
        redirect_to fitness_log_path(@log), notice: 'Log entry was successfully updated.'
      else
        Rails.logger.debug(@log.errors.full_messages.to_sentence)
        @is_edit_page = true
        render :edit, status: :unprocessable_entity
      end
    end

    def show
      # Associations are preloaded in set_log
    end

    def destroy
      @log.destroy
      redirect_to fitness_logs_path, notice: 'Log entry was successfully deleted.'
    end

    private

    def set_log
      @log = current_user.fitness_log_entries.includes(fitness_log_exercises: :fitness_log_sets).find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to fitness_logs_path, alert: 'Log not found.'
    end

    def log_params
      params.require(:fitness_log_entry).permit(
        :date,
        :time,
        :notes,
        fitness_log_exercises_attributes: [
          :id,
          :exercise_id,
          :_destroy,
          fitness_log_sets_attributes: [
            :id,
            :reps,
            :weight,
            :duration,
            :distance,
            :intensity,
            :style,
            :_destroy
          ]
        ]
      )
    end
  end
end
