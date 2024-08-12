module Objectives
  class FitnessGoalsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_fitness_goal, only: [:update, :destroy]

    def create
      @fitness_goal = FitnessGoal.new(fitness_goal_params)
      @goal = Goal.find(params[:goal_id])
      @fitness_goal.goal = @goal

      if @fitness_goal.save
        redirect_to objectives_goal_path(@goal), notice: 'Fitness goal was successfully created.'
      else
        redirect_to edit_objectives_goal_path(@goal), alert: 'Failed to create fitness goal.'
      end
    end

    def update
      @goal = @fitness_goal.goal

      if @fitness_goal.update(fitness_goal_params)
        redirect_to objectives_goal_path(@goal), notice: 'Fitness goal was successfully updated.'
      else
        redirect_to edit_objectives_goal_path(@goal), alert: 'Failed to update fitness goal.'
      end
    end

    def destroy
      goal = @fitness_goal.goal
      @fitness_goal.destroy
      redirect_to objectives_goal_path(goal), notice: 'Fitness goal was successfully destroyed.'
    end

    private

    def set_fitness_goal
      @fitness_goal = FitnessGoal.find(params[:id])
    end

    def fitness_goal_params
      params.require(:fitness_goal).permit(:exercise_id, :sets, :reps, :distance, :frequency, :duration, :goal_id, :intensity, :calories_burned, :date)
    end
  end
end
