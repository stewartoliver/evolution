class CsvImportJob
  include Sidekiq::Worker

  def perform(file_path, user_id, account_id)
    Rails.logger.info "Starting CSV import for user #{user_id}, account #{account_id}"
    user = User.find(user_id)
    account = user.accounts.find(account_id)
    
    CsvImportService.new(file_path, user, account).import_transactions
    
    Rails.logger.info "Completed CSV import for user #{user_id}, account #{account_id}"
  rescue => e
    Rails.logger.error "Error during CSV import: #{e.message}"
    raise e
  end
end
