class CreateSets < ActiveRecord::Migration[7.1]
  def change
    create_table :sets do |t|
      t.references :routine_exercise, null: false, foreign_key: true
      t.integer :reps
      t.decimal :weight
      t.date :date

      t.timestamps
    end
  end
end
