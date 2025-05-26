module Objectives
  class ChoresController < ApplicationController
    before_action :set_chore, only: [:show, :edit, :update, :destroy, :complete]

    def index
      @chores = Chore.where(user: current_user)
      @chore_charts = ChoreChart.where(user: current_user)
      # TODO: Split into Today, Upcoming, Overdue
    end

    def show; end

    def new
      @chore = Chore.new
    end

    def create
      @chore = Chore.new(chore_params)
      @chore.user = current_user
      if @chore.save
        redirect_to objectives_chores_path, notice: 'Chore created.'
      else
        render :new
      end
    end

    def edit; end

    def update
      if @chore.update(chore_params)
        redirect_to objectives_chores_path, notice: 'Chore updated.'
      else
        render :edit
      end
    end

    def destroy
      @chore.destroy
      redirect_to objectives_chores_path, notice: 'Chore deleted.'
    end

    def complete
      @chore.completed = true
      @chore.last_completed_at = Time.current
      # TODO: Calculate next_due_at based on repeat_rule
      @chore.save
      redirect_to objectives_chores_path, notice: 'Chore marked as complete.'
    end

    private

    def set_chore
      @chore = Chore.find(params[:id])
    end

    def chore_params
      params.require(:chore).permit(:name, :description, :category, :repeat_rule, :repeat_every, :day_of_week, :estimated_minutes, :chore_chart_id, :next_due_at)
    end
  end
end 