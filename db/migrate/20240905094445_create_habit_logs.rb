class CreateHabitLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :habit_logs do |t|
      t.references :habit, null: false, foreign_key: true # Links to a specific habit
      t.date :date, null: false                           # Date when habit was performed
      t.integer :occurrences, null: false, default: 0     # Number of times habit was performed
      t.timestamps  
    end
  end
end
