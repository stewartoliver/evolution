class CsvImportJob < ApplicationJob
  queue_as :default

  def perform(file_path, user_id, account_id)
    user = User.find(user_id)
    Rails.logger.info "Starting CSV import for user #{user.id}"
    CsvImportService.new(file_path, user, account_id).import_bank_statements
  end
end
