class CreateFitnessGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :fitness_goals do |t|
      t.string :exercise
      t.integer :duration
      t.datetime :date
      t.references :goal, polymorphic: true, null: false

      t.timestamps
    end
  end
end
