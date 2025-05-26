module Finances
  class ExpensesController < ApplicationController
    before_action :set_expense, only: [:show, :edit, :update, :destroy, :mark_as_paid, :unmark_as_paid]
    before_action :set_accounts, only: [:new, :edit, :create, :update]
    before_action :set_categories, only: [:new, :edit, :create, :update]
    before_action :set_financial_stores, only: [:new, :edit, :create, :update]
    before_action :set_user_stores, only: [:new, :edit, :create, :update]

    def index
      @expenses = current_user.expenses.includes(:account, :category, :financial_store, :user_store)
        .order(date: :desc)
        .page(params[:page])
        .per(20)
    end

    def show
    end

    def new
      @expense = current_user.expenses.new
    end

    def edit
    end

    def create
      @expense = current_user.expenses.new(expense_params)

      if @expense.save
        redirect_to finances_expense_path(@expense), notice: 'Expense was successfully created.'
      else
        render :new, status: :unprocessable_entity
      end
    end

    def update
      if @expense.update(expense_params)
        redirect_to finances_expense_path(@expense), notice: 'Expense was successfully updated.'
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @expense.destroy
      redirect_to finances_expenses_path, notice: 'Expense was successfully destroyed.'
    end

    def mark_as_paid
      date = Date.parse(params[:date])
      
      begin
        @expense.mark_as_paid(date, current_user)
        redirect_to finances_expense_path(@expense), notice: 'Expense was marked as paid.'
      rescue ActiveRecord::RecordInvalid => e
        redirect_to finances_expense_path(@expense), alert: "Could not mark expense as paid: #{e.message}"
      end
    end

    def unmark_as_paid
      date = Date.parse(params[:date])
      
      @expense.unmark_as_paid(date)
      redirect_to finances_expense_path(@expense), notice: 'Expense was unmarked as paid.'
    end

    private

    def set_expense
      @expense = current_user.expenses.find(params[:id])
    end

    def set_accounts
      @accounts = current_user.accounts.order(:name)
    end

    def set_categories
      @categories = Category.order(:name)
    end

    def set_financial_stores
      @financial_stores = FinancialStore.order(:name)
    end

    def set_user_stores
      @user_stores = current_user.user_stores.order(:name)
    end

    def expense_params
      params.require(:expense).permit(
        :account_id, :amount, :date, :description, :sub_category, :category_id,
        :financial_store_id, :user_store_id, :recurring, :frequency, :frequency_unit,
        :custom_frequency, :day_of_week, :day_of_month, :end_date
      )
    end
  end
end
