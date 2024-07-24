module Finances
  class AccountsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_account, only: [:show, :edit, :update, :destroy]

    def index
      @accounts = current_user.accounts
    end

    def show
    end

    def new
      @account = Account.new
    end

    def create
      @account = current_user.accounts.build(account_params)
      if @account.save
        redirect_to finances_account_path(@account), notice: 'Account was successfully created.'
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @account.update(account_params)
        redirect_to finances_account_path(@account), notice: 'Account was successfully updated.'
      else
        render :edit
      end
    end

    def destroy
      @account.destroy
      redirect_to accounts_url, notice: 'Account was successfully destroyed.'
    end

    private

    def set_account
      @account = current_user.accounts.find(params[:id])
    end

    def account_params
      params.require(:account).permit(:account_name, :account_type, :balance)
    end
  end
end
