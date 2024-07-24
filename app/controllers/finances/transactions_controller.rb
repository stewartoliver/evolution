module Finances
  class TransactionsController < ApplicationController
    before_action :set_transaction, only: [:show, :edit, :update, :destroy]

    def index
      @account = Account.find(params[:account_id])
      @transactions = @account.transactions
    end

    def show
    end

    def new
      @transaction = Transaction.new
    end

    def create
      @transaction = Transaction.new(transaction_params)
      if @transaction.save
        redirect_to finances_transaction_path(@transaction), notice: 'Transaction was successfully created.'
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @transaction.update(transaction_params)
        redirect_to finances_transaction_path(@transaction), notice: 'Transaction was successfully updated.'
      else
        render :edit
      end
    end

    def destroy
      @transaction.destroy
      redirect_to finances_transactions_path(@transaction), notice: 'Transaction was successfully destroyed.'
    end

    private

    def set_transaction
      @transaction = Transaction.find(params[:id])
    end

    def transaction_params
      params.require(:transaction).permit(:account_id, :transaction_type, :amount, :description, :date)
    end
  end
end
