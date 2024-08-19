class CsvImportService
  def initialize(csv_file, user, account)
    @csv_file = csv_file
    @user = user
    @account = account
  end

  def import_transactions
    begin
      Rails.logger.info "Starting CSV parsing"
      SmarterCSV.process(@csv_file, chunk_size: 100, col_sep: ',', headers_in_file: true) do |chunk|
        chunk.each do |row|
          Rails.logger.info "Processing row: #{row.inspect}"
          process_row(row)
        end
      end
      Rails.logger.info "Completed CSV import successfully"
    rescue => e
      Rails.logger.error "CSV Import Error: #{e.message}"
      raise "There was an issue with the CSV import. Please check the format and try again."
    end
  end

  private

  def process_row(row)
    financial_account = @user.accounts.find(params[:account_id])
    financial_store = Transaction.match_store(row[:reference])

    transaction = @user.transactions.create!(
      account_id: financial_account.id,
      transaction_type: row[:type],
      amount: row[:amount].to_d,
    description: row[:details], # Ensure this matches the column in your CSV
    date: Date.strptime(row[:date], "%d/%m/%Y"),
    financial_store: financial_store
    )

    if transaction.persisted?
      Rails.logger.info "Transaction saved: #{transaction.inspect}"
    else
      Rails.logger.error "Failed to save transaction: #{transaction.errors.full_messages.join(', ')}"
    end
  rescue => e
    Rails.logger.error "Error processing row: #{e.message}"
    raise e
  end
end
