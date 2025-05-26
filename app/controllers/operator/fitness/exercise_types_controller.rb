module Operator
  module Fitness
    class ExerciseTypesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_exercise_type, only: [:show, :edit, :update, :destroy, :merge]
      before_action :set_exercise_types, only: [:index, :merge]

      def index
      end

      def new
        @exercise_type = ExerciseType.new
      end

      def create
        @exercise_type = ExerciseType.new(exercise_type_params)
        if @exercise_type.save
          redirect_to operator_fitness_exercise_type_path(@exercise_type), notice: 'Exercise type was successfully created.'
        else
          render :new
        end
      end

      def edit
      end

      def update
        if @exercise_type.update(exercise_type_params)
          redirect_to operator_fitness_exercise_type_path(@exercise_type), notice: 'Exercise type was successfully updated.'
        else
          render :edit
        end
      end

      def show
      end

      def destroy
        @exercise_type.destroy
        redirect_to operator_fitness_exercise_types_path, notice: 'Exercise type was successfully deleted.'
      end

      def merge
        @source_exercise_type = @exercise_type
        @target_exercise_type = ExerciseType.find(params[:target_id])
        
        ExerciseType.transaction do
          # Update all exercises to use the target exercise type
          @source_exercise_type.exercises.update_all(exercise_type_id: @target_exercise_type.id)
          
          # Delete the source exercise type
          @source_exercise_type.destroy
        end

        redirect_to operator_fitness_exercise_types_path, notice: 'Exercise types were successfully merged.'
      rescue ActiveRecord::RecordNotFound
        redirect_to operator_fitness_exercise_types_path, alert: 'Target exercise type not found.'
      rescue StandardError => e
        redirect_to operator_fitness_exercise_types_path, alert: "Failed to merge exercise types: #{e.message}"
      end

      private

      def set_exercise_type
        @exercise_type = ExerciseType.find(params[:id])
      end

      def set_exercise_types
        @exercise_types = ExerciseType.all
      end

      def exercise_type_params
        params.require(:exercise_type).permit(:name, :colour, :icon, :description)
      end
    end
  end
end
