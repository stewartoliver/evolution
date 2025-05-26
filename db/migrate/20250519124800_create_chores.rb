class CreateChores < ActiveRecord::Migration[7.1]
  def change
    create_table :chores do |t|
      t.references :user, null: false, foreign_key: true
      t.references :chore_chart, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.string :category
      t.string :repeat_rule
      t.integer :repeat_every
      t.string :day_of_week
      t.integer :estimated_minutes
      t.datetime :last_completed_at
      t.datetime :next_due_at
      t.boolean :completed

      t.timestamps
    end
  end
end
