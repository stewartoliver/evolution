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

    def use_routine_and_create_log
      Rails.logger.debug "Starting use_routine_and_create_log for routine_id: #{params[:id]}"
    
      begin
        routine = current_user.routines.includes(routine_exercises: [:exercise, :routine_sets]).find(params[:id])
        Rails.logger.debug "Routine found: #{routine.inspect}"
    
        fitness_log_entry = current_user.fitness_log_entries.create!(
          routine_id: routine.id,
          notes: routine.description,
          date: Date.current,
          time: Time.current
        )
        Rails.logger.debug "Fitness Log Entry created: #{fitness_log_entry.inspect}"
    
        # Debug: Check routine exercises
        Rails.logger.debug "Routine Exercises count: #{routine.routine_exercises.count}"
    
        routine.routine_exercises.each do |routine_exercise|
          Rails.logger.debug "Processing routine exercise: #{routine_exercise.inspect}"
    
          # Validate exercise existence
          unless routine_exercise.exercise
            Rails.logger.debug "No exercise found for routine exercise: #{routine_exercise.id}"
            next
          end
    
          fitness_log_exercise = fitness_log_entry.fitness_log_exercises.create!(
            exercise_id: routine_exercise.exercise_id
          )
          Rails.logger.debug "Fitness Log Exercise created: #{fitness_log_exercise.inspect}"
    
          # Debug: Check routine sets
          Rails.logger.debug "Routine Sets count for exercise: #{routine_exercise.routine_sets.count}"
    
          routine_exercise.routine_sets.each do |routine_set|
            log_set = fitness_log_exercise.fitness_log_sets.create!(
              reps: routine_set.reps,
              weight: routine_set.weight,
              duration: routine_set.duration,
              distance: routine_set.distance,
              style: routine_set.style,
              intensity: routine_set.intensity
            )
            Rails.logger.debug "Fitness Log Set created: #{log_set.inspect}"
          end
        end
    
        flash[:notice] = "Log created successfully from routine!"
        redirect_to fitness_log_path(fitness_log_entry)
      rescue ActiveRecord::RecordInvalid => e
        Rails.logger.error "Record Invalid Error: #{e.record.errors.full_messages.join(', ')}"
        flash[:alert] = "Failed to create log: #{e.record.errors.full_messages.join(', ')}"
        redirect_to fitness_routine_path(routine)
      rescue StandardError => e
        Rails.logger.error "Unexpected Error: #{e.message}"
        flash[:alert] = "An unexpected error occurred: #{e.message}"
        redirect_to fitness_routines_path
      end
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
