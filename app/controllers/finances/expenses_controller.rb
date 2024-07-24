module Finances
  class ExpensesController < ApplicationController
    before_action :set_expense, only: [:show, :edit, :update, :destroy]

    def index
      @expenses = current_user.accounts.includes(:expenses).flat_map(&:expenses)
    end

    def show
    end

    def new
      @expense = Expense.new
    end

    def create
      @expense = Expense.new(expense_params)
      if @expense.save
        redirect_to finances_expenses_path(@expense), notice: 'Expense was successfully created.'
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @expense.update(expense_params)
        redirect_to finances_expense_path(@expense), notice: 'Expense was successfully updated.'
      else
        render :edit
      end
    end

    def destroy
      @expense.destroy
      redirect_to finances_account_path(@expense.account), notice: 'Expense was successfully destroyed.'
    end

    private

    def set_expense
      @expense = Expense.find(params[:id])
    end

    def expense_params
      params.require(:expense).permit(:account_id, :amount, :category, :description, :date)
    end
  end
end
