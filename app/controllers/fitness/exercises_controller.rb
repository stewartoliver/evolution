module Fitness
  class ExercisesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_exercise, only: [:show, :edit, :update]

    def index
      @exercises = Exercise.includes(:exercise_type, :muscle_group)
                          .where.not(exercise_type_id: nil)
                          .where.not(muscle_group_id: nil)
                          .order(:name)
                          .all

      respond_to do |format|
        format.html
        format.json do
          render json: @exercises.to_json(
            include: {
              exercise_type: { only: [:id, :name, :colour, :icon] },
              muscle_group: { only: [:id, :name] },
              equipment: { only: [:id, :name] }
            }
          )
        end
      end
    end

    def new
      @exercise = Exercise.new
    end

    def create
      @exercise = Exercise.new(exercise_params)
      @exercise.added_by_id = current_user.id
      
      if @exercise.save
        respond_to do |format|
          format.html { redirect_to fitness_exercises_path, notice: 'Exercise was successfully created.' }
          format.json { render json: @exercise, status: :created }
        end
      else
        respond_to do |format|
          format.html { render :new }
          format.json { render json: @exercise.errors, status: :unprocessable_entity }
        end
      end
    end

    def edit
    end

    def update
      if @exercise.update(exercise_params)
        respond_to do |format|
          format.html { redirect_to fitness_exercises_path, notice: 'Exercise was successfully updated.' }
          format.json { render json: @exercise }
        end
      else
        respond_to do |format|
          format.html { render :edit }
          format.json { render json: @exercise.errors, status: :unprocessable_entity }
        end
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
