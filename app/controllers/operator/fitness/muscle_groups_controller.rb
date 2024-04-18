module Operator
  module Fitness
    class MuscleGroupsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_muscle_group, only: [:show, :edit, :update]

      def index
        @muscle_groups = MuscleGroup.all
      end

      def new
        @muscle_group = MuscleGroup.new
      end

      def create
        @muscle_group = MuscleGroup.new(muscle_group_params)
        if @muscle_group.save
          redirect_to operator_fitness_muscle_groups_path, notice: 'Muscle group was successfully created.'
        else
          render :new
        end
      end

      def edit
      end

      def update
        @muscle_group = MuscleGroup.find(muscle_group_params[:id])
        if @muscle_group.save
          redirect_to operator_fitness_muscle_groups_path, notice: 'Muscle group was successfully created.'
        else
          render :new
        end
      end

      def show
      end

      private

      def set_muscle_group
        @muscle_group = MuscleGroup.find(params[:id])
      end

      def muscle_group_params
        params.require(:muscle_group).permit(:name)
      end
    end
  end
end
