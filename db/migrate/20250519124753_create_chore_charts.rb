class CreateChoreCharts < ActiveRecord::Migration[7.1]
  def change
    create_table :chore_charts do |t|
      t.string :name
      t.references :user, null: false, foreign_key: true
      t.string :rotation_frequency
      t.datetime :start_date
      t.text :description

      t.timestamps
    end
  end
end
