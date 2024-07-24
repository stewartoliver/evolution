module Finances
  class IncomesController < ApplicationController
    before_action :set_income, only: [:show, :edit, :update, :destroy]

    def index
      @incomes = current_user.accounts.includes(:incomes).flat_map(&:incomes)
    end

    def show
    end

    def new
      @income = Income.new
    end

    def create
      @income = Income.new(income_params)
      if @income.save
        redirect_to finances_income_path(@income), notice: 'Income was successfully created.'
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @income.update(income_params)
        redirect_to finances_income_path(@income), notice: 'Income was successfully updated.'
      else
        render :edit
      end
    end

    def destroy
      @income.destroy
      redirect_to finances_account_path(@income.account), notice: 'Income was successfully destroyed.'
    end

    private

    def set_income
      @income = Income.find(params[:id])
    end

    def income_params
      params.require(:income).permit(:account_id, :amount, :source, :date)
    end
  end
end
