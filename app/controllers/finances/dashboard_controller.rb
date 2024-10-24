module Finances
  class DashboardController < ApplicationController
    before_action :authenticate_user!

    def index
      @user_financial_accounts = current_user.accounts
      @user_recent_transactions = current_user.transactions.order(date: :desc).take(12)
      @user_upcoming_expenses = current_user.expenses.recurring_upcoming(14)
    end
  end
end
