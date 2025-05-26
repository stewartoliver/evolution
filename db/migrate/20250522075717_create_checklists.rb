class CreateChecklists < ActiveRecord::Migration[7.0]
  def up
    # First create the checklists table
    create_table :checklists do |t|
      t.string :title, null: false
      t.references :task, null: false, foreign_key: true

      t.timestamps
    end

    # Add checklist_id column allowing null values initially
    add_reference :checklist_items, :checklist, null: true, foreign_key: true

    # Create a default checklist for each task that has checklist items
    execute <<-SQL
      INSERT INTO checklists (title, task_id, created_at, updated_at)
      SELECT DISTINCT 'Default Checklist', task_id, NOW(), NOW()
      FROM checklist_items;
    SQL

    # Update checklist_items to point to the newly created checklists
    execute <<-SQL
      UPDATE checklist_items
      SET checklist_id = checklists.id
      FROM checklists
      WHERE checklist_items.task_id = checklists.task_id;
    SQL

    # Now make checklist_id non-null
    change_column_null :checklist_items, :checklist_id, false

    # Finally remove the task_id reference
    remove_reference :checklist_items, :task
  end

  def down
    # Add back task_id column
    add_reference :checklist_items, :task, null: true, foreign_key: true

    # Update task_id based on the checklist's task
    execute <<-SQL
      UPDATE checklist_items
      SET task_id = checklists.task_id
      FROM checklists
      WHERE checklist_items.checklist_id = checklists.id;
    SQL

    # Make task_id non-null
    change_column_null :checklist_items, :task_id, false

    # Remove checklist_id
    remove_reference :checklist_items, :checklist

    # Drop checklists table
    drop_table :checklists
  end
end