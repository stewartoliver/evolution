class CsvImportService
  def initialize(csv_file, user, account_id)
    @csv_file = csv_file
    @user = user
    @account_id = account_id
  end

  def import_bank_statements
    Rails.logger.info "Starting CSV parsing"

    options = {
      chunk_size: 100,
      col_sep: ',',
      header_transformations: [
        :downcase,
        :symbolize,
        lambda { |header| header.strip.gsub(' ', '_') }
      ],
      key_mapping: {
        type: :transaction_type,
        details: :details,
        particulars: :particulars,
        code: :code,
        reference: :reference,
        amount: :amount,
        date: :transaction_date,
        foreigncurrencyamount: :foreign_currency_amount,
        conversioncharge: :conversion_charge
      }
    }

    if headers_present?
      options[:headers_in_file] = true
    else
      options[:headers_in_file] = false
      options[:user_provided_headers] = [
        'Type', 'Details', 'Particulars', 'Code', 'Reference',
        'Amount', 'Date', 'ForeignCurrencyAmount', 'ConversionCharge'
      ]
    end

    SmarterCSV.process(@csv_file, options) do |chunk|
      chunk.each do |row|
        Rails.logger.info "Processing row: #{row.inspect}"
        process_row(row)
      end
    end

    Rails.logger.info "Completed CSV import successfully"
  rescue => e
    Rails.logger.error "CSV Import Error: #{e.message}"
  ensure
    File.delete(@csv_file) if File.exist?(@csv_file)
  end

  private

  def headers_present?
    first_line = File.open(@csv_file, &:readline).strip.downcase
    first_line.start_with?('type,')
  rescue EOFError
    false
  end

  def process_row(row)
    attributes = {
      transaction_type: row[:transaction_type],
      amount: row[:amount]&.to_d,
      date: Date.strptime(row[:transaction_date], "%d/%m/%Y"),
      user_id: @user.id,
      account_id: @account_id,
      description: build_description(row)
    }

    transaction = Transaction.create!(attributes)

    Rails.logger.info "Transaction saved: #{transaction.inspect}"
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Failed to save transaction for row #{row.inspect}: #{e.record.errors.full_messages.join(', ')}"
  rescue => e
    Rails.logger.error "Error processing row #{row.inspect}: #{e.message}"
  end

  def build_description(row)
    parts = []
    parts << row[:details] if row[:details].present?
    parts << row[:particulars] if row[:particulars].present?
    parts << row[:code] if row[:code].present?
    parts << row[:reference] if row[:reference].present?
    parts.join(' | ')
  end
end
