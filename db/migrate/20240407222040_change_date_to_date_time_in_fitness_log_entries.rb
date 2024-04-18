class ChangeDateToDateTimeInFitnessLogEntries < ActiveRecord::Migration[7.1]
  def change
    change_column :fitness_log_entries, :date, :datetime
  end
end
