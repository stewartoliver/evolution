module Operator
  module Fitness
    class ExerciseTypesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_exercise_type, only: [:show, :edit, :update]

      def index
        @exercise_types = ExerciseType.all
      end

      def new
        @exercise_type = ExerciseType.new
      end

      def create
        @exercise_type = ExerciseType.new(exercise_type_params)
        if @exercise_type.save
          redirect_to operator_fitness_exercise_types_path, notice: 'Exercise type was successfully created.'
        else
          render :new
        end
      end

      def edit
      end

      def update
        @exercise_type = ExerciseType.find(exercise_type_params[:id])
        if @exercise_type.save
          redirect_to operator_fitness_exercise_types_path, notice: 'Exercise type was successfully created.'
        else
          render :new
        end
      end

      def show
      end

      private

      def set_exercise_type
        @exercise_type = ExerciseType.find(params[:id])
      end

      def exercise_type_params
        params.require(:exercise_type).permit(:name)
      end
    end
  end
end
