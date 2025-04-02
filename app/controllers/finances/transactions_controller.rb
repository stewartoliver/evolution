module Finances
  class TransactionsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_transaction, only: [:show, :edit, :update, :destroy, :create_expense_from_similar]
    before_action :set_accounts, only: [:new, :edit, :show, :index]

    def index
      @recent_transactions = current_user.transactions.includes(:category, :account).order(created_at: :desc)
      @categories = Category.all
    end

    def show
    end

    def new
      @transaction = current_user.transactions.new
    end

    def update
      if @transaction.update(transaction_params)
        redirect_to finances_transaction_path(@transaction), notice: 'Transaction was successfully updated.'
      else
        redirect_to edit_finances_transaction_path(@transaction), alert: 'There was an error updating the transaction.'
      end      
    end    

    def edit
    end

    def destroy
      @transaction.destroy
      redirect_to finances_transactions_path, notice: 'Transaction was successfully destroyed.'
    end

    def create_expense_from_similar
      similar_transactions = @transaction.similar_transactions
      
      if similar_transactions.any?
        # Get the date range from similar transactions
        start_date = similar_transactions.minimum(:date)
        end_date = similar_transactions.maximum(:date)
        
        # Create the expense
        expense = current_user.expenses.new(
          account_id: @transaction.account_id,
          amount: @transaction.amount.abs,
          name: @transaction.details || @transaction.description,
          description: "Created from similar transactions between #{start_date.strftime('%B %d, %Y')} and #{end_date.strftime('%B %d, %Y')}",
          date: start_date,
          category_id: @transaction.category_id,
          recurring: true,
          frequency: 'monthly',
          end_date: end_date,
          sub_category: @transaction.transaction_type || 'Regular',
          day_of_month: start_date.day     # Set the frequency unit for monthly recurrence
        )
        
        if expense.save
          redirect_to finances_transaction_path(@transaction), notice: 'Expense was successfully created from similar transactions.'
        else
          Rails.logger.error "Failed to create expense: #{expense.errors.full_messages.join(', ')}"
          redirect_to finances_transaction_path(@transaction), alert: "Failed to create expense: #{expense.errors.full_messages.join(', ')}"
        end
      else
        redirect_to finances_transaction_path(@transaction), alert: 'No similar transactions found to create an expense from.'
      end
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
      @transaction = current_user.transactions.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to finances_transactions_path, alert: 'Transaction not found.'
    end

    def set_accounts
      @accounts = current_user.accounts
    end

    def transaction_params
      params.require(:transaction).permit(:amount, :description, :transaction_type, :category_id, :account_id, :details, :particulars, :code, :reference, :date)
    end
  end
end
