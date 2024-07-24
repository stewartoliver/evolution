class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.references :goal, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description
      t.string :status, default: 'not started'
      t.date :due_date

      t.timestamps
    end
  end
end
