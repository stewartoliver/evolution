class UpdateGoalsTable < ActiveRecord::Migration[7.1]
  def change
    t.remove :priority
      t.remove :tags
      t.remove :reminder_frequency
      t.remove :notes

      t.boolean :is_favorite, default: false
      t.string :status, default: 'not started'
      t.integer :progress, default: 0, null: false
      t.references :parent_goal, foreign_key: { to_table: :goals }
  end
end
