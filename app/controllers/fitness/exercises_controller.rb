module Fitness
  class ExercisesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_exercise, only: [:show, :edit, :update]

    def index
      @exercises = Exercise.includes(:exercise_type, :muscle_group).all

      respond_to do |format|
        format.html    
        format.json { render json: @exercises.to_json(include: [:exercise_type, :muscle_group]) }
      end
    end

    def new
      @exercise = Exercise.new
    end

    def create
      @exercise = Exercise.new(exercise_params)
      @exercise.added_by_id = current_user.id
      if @exercise.save
        redirect_to fitness_exercises_path, notice: 'Exercise was successfully created.'
      else
        puts @exercise.errors.full_messages
        render :new
      end
    end

    def edit
    end

    def update
      if @exercise.update(exercise_params)
        redirect_to fitness_exercises_path, notice: 'Exercise was successfully updated.'
      else
        render :edit
      end
    end

    def show
      respond_to do |format|
        format.html
        format.json { render json: @exercise }
      end
    end

    private

    def set_exercise
      @exercise = Exercise.find(params[:id])
    end

    def exercise_params
      params.require(:exercise).permit(:name, :muscle_group_id, :exercise_type_id, :description)
    end
  end
end
