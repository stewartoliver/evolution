module Fitness
  class RoutinesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_routine, only: [:edit, :update, :show, :destroy]

    def index
      @routines = current_user.routines.includes(routine_exercises: :routine_sets)
    end

    def new
      @routine = current_user.routines.build
      @is_edit_page = false
      # Build an initial routine_exercise and routine_set for the form
      routine_exercise = @routine.routine_exercises.build
      routine_exercise.routine_sets.build
    end

    def edit
      @is_edit_page = true
      # If you need to ensure at least one routine_exercise and routine_set, you can build them here if necessary
      if @routine.routine_exercises.empty?
        routine_exercise = @routine.routine_exercises.build
        routine_exercise.routine_sets.build
      end
    end

    def create
      @routine = current_user.routines.build(routine_params)
      if @routine.save
        redirect_to fitness_routine_path(@routine), notice: 'Routine was successfully created.'
      else
        Rails.logger.debug(@routine.errors.full_messages.to_sentence)
        render :new
      end
    end

    def update
      if @routine.update(routine_params)
        redirect_to fitness_routine_path(@routine), notice: 'Routine was successfully updated.'
      else
        Rails.logger.debug(@routine.errors.full_messages.to_sentence)
        render :edit, status: :unprocessable_entity
      end
    end


    def show
      # Associations are preloaded in set_routine
    end

    def destroy
      @routine.destroy
      redirect_to fitness_routines_path, notice: 'Routine was successfully deleted.'
    end

    private

    def set_routine
      @routine = current_user.routines.includes(routine_exercises: :routine_sets).find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to fitness_routines_path, alert: 'Routine not found.'
    end

    def routine_params
      params.require(:routine).permit(
        :name, 
        :description, 
        routine_exercises_attributes: [
          :id, 
          :exercise_id, 
          :_destroy, 
          routine_sets_attributes: [
            :id, 
            :reps, 
            :weight, 
            :duration, 
            :distance, 
            :style, 
            :intensity, 
            :_destroy
          ]
        ]
        )
    end
  end
end
