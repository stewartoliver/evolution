class CreateChecklistItems < ActiveRecord::Migration[7.1]
  def change
    create_table :checklist_items do |t|
      t.references :task, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description
      t.boolean :completed, default: false
      t.datetime :completed_at
      t.integer :position
      t.timestamps
    end
    
    add_index :checklist_items, [:task_id, :position]
  end
end 