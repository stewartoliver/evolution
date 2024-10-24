module Finances
  class ExpensesController < ApplicationController
    before_action :set_expense, only: [:show, :edit, :update, :destroy]

    def index
      @expenses = current_user.expenses
    end

    def new
      @expense = Expense.new
    end

    def create
      @expense = current_user.expenses.new(expense_params)
      if @expense.save
        redirect_to finances_expenses_path, notice: 'Expense was successfully created.'
      else
        render :new
      end
    end

    def edit
      @expense = current_user.expenses.find(params[:id])
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
      redirect_to finances_expenses_path, notice: 'Expense was successfully destroyed.'
    end

    private

    def set_expense
      @expense = current_user.expenses.find(params[:id])
    end

    def expense_params
      params.require(:expense).permit(:account_id, :amount, :sub_category, :description, :date, :recurring, :frequency, :next_occurrence, :end_date, :category_id, :store_id, :custom_frequency, :frequency_unit, :day_of_week, :day_of_month, :payment_method, :notes, :currency, :vendor, :tax_deductible, :receipt_attached, :user_id, :name)
    end
  end
end
