class CreateGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :goals do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description
      t.integer :priority
      t.date :start_date
      t.date :end_date
      t.integer :progress, default: 0
      t.string :tags, array: true, default: []
      t.string :reminder_frequency
      t.text :notes

      t.timestamps
    end
  end
end
