class CreateFitnessLogEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :fitness_log_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false
      t.references :routine, foreign_key: true
      t.text :notes
      t.timestamps
    end
  end
end
