class CreateChoreLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :chore_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.references :chore, null: false, foreign_key: true
      t.datetime :completed_at, null: false
      t.text :notes, null: true
      t.boolean :was_skipped, null: true, default: false

      t.timestamps
    end
  end
end
