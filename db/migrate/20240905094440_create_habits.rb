class CreateHabits < ActiveRecord::Migration[7.1]
  def change
    create_table :habits do |t|
      t.references :user, null: false, foreign_key: true # Links to user
      t.references :goal, foreign_key: true              # Optional link to a goal
      t.references :task, foreign_key: true              # Optional link to a task
      t.string :name, null: false                        # Name of the habit
      t.text :description                                # Optional description
      t.string :frequency, null: false                   # Frequency (Daily, Weekly, etc.)
      t.integer :target_occurrences                      # Number of occurrences within the frequency
      t.timestamps 
    end
  end
end
