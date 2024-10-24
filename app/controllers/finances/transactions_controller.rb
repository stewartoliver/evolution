module Finances
  class TransactionsController < ApplicationController
    before_action :set_transaction, only: [:show, :edit, :update, :destroy]

    def index
      @transactions = Transaction.all
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
      redirect_to finances_transactions_path, notice: 'Transaction was successfully destroyed.'
    end

    def import
      if params[:file].present? && params[:account_id].present?
        file_path = Rails.root.join('tmp', "#{SecureRandom.hex}_#{params[:file].original_filename}")

        begin
          Rails.logger.info "Starting file upload: #{file_path}"
          File.open(file_path, 'wb') do |file|
            file.write(params[:file].read)
          end

          Rails.logger.info "File uploaded successfully: #{file_path}"
          CsvImportJob.perform_later(file_path.to_s, current_user.id, params[:account_id])
          Rails.logger.info "CSV import job scheduled for user #{current_user.id}"

          redirect_to finances_transactions_path, notice: "CSV is being processed. You will be notified once it's done."
        rescue => e
          Rails.logger.error "Error during file upload or job scheduling: #{e.message}"
          redirect_to finances_transactions_path, alert: "There was an error processing your request. Please try again."
        end
      else
        redirect_to finances_transactions_path, alert: "Please select an account and upload a file."
      end
    end

    def recategorize_all
      @transactions = current_user.transactions

      success_count = 0
      failure_count = 0

      @transactions.find_each do |transaction|
        begin
          TransactionCategorizer.new(transaction).categorize
          transaction.save!
          success_count += 1
        rescue => e
          Rails.logger.error "Failed to categorize Transaction ID #{transaction.id}: #{e.message}"
          failure_count += 1
        end
      end

      if failure_count > 0
        flash[:alert] = "Recategorization completed with #{failure_count} failures."
      else
        flash[:notice] = "All transactions have been successfully recategorized."
      end

      redirect_to finances_transactions_path
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
