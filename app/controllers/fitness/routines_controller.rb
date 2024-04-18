module Fitness
  class RoutinesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_routine, only: [:show, :edit, :update]

    def index
      @routines = Routine.all
    end

    def new
      @routine = Routine.new
    end

    def create
      @routine = Routine.new(routine_params)
      @routine.user = current_user
      if @routine.save
        redirect_to fitness_routines_path, notice: 'Routine was successfully created.'
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @routine.update(routine_params)
        redirect_to fitness_routines_path, notice: 'Routine was successfully updated.'
      else
        render :edit
      end
    end

    def show
    end

    private

    def set_routine
      @routine = Routine.find(params[:id])
    end

    def routine_params
      params.require(:routine).permit(:name, routine_exercises_attributes: [:id, :order, :exercise_id, :_destroy, routine_sets_attributes: [:id, :reps, :weight, :_destroy]])
    end
  end
end
