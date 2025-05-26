module Objectives
  class ChoreChartsController < ApplicationController
    before_action :set_chore_chart, only: [:show, :edit, :update, :destroy]

    def index
      @chore_charts = ChoreChart.where(user: current_user)
    end

    def show
      @chores = @chore_chart.chores
    end

    def new
      @chore_chart = ChoreChart.new
    end

    def create
      @chore_chart = ChoreChart.new(chore_chart_params)
      @chore_chart.user = current_user
      if @chore_chart.save
        redirect_to chore_charts_path, notice: 'Chore chart created.'
      else
        render :new
      end
    end

    def edit; end

    def update
      if @chore_chart.update(chore_chart_params)
        redirect_to chore_charts_path, notice: 'Chore chart updated.'
      else
        render :edit
      end
    end

    def destroy
      @chore_chart.destroy
      redirect_to chore_charts_path, notice: 'Chore chart deleted.'
    end

    private

    def set_chore_chart
      @chore_chart = ChoreChart.find(params[:id])
    end

    def chore_chart_params
      params.require(:chore_chart).permit(:name, :rotation_frequency, :start_date, :description)
    end
  end
end 