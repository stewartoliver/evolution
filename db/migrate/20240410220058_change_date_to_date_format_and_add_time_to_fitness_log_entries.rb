class ChangeDateToDateFormatAndAddTimeToFitnessLogEntries < ActiveRecord::Migration[7.1]
  def change
    change_column :fitness_log_entries, :date, :date
    add_column :fitness_log_entries, :time, :time
  end
end
