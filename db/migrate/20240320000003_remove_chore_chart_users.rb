class RemoveChoreChartUsers < ActiveRecord::Migration[7.1]
  def up
    # First, ensure all users are migrated to chore_rotation_users
    execute <<-SQL
      INSERT INTO chore_rotation_users (chore_rotation_id, name, email, user_id, position, created_at, updated_at)
      SELECT 
        cr.id,
        ccu.name,
        ccu.email,
        ccu.user_id,
        ccu.position,
        ccu.created_at,
        ccu.updated_at
      FROM chore_chart_users ccu
      JOIN chore_rotations cr ON cr.chore_chart_id = ccu.chore_chart_id
      WHERE cr.rotation_number = (
        SELECT MAX(rotation_number) 
        FROM chore_rotations 
        WHERE chore_chart_id = ccu.chore_chart_id
      )
      ON CONFLICT (chore_rotation_id, position) DO NOTHING;
    SQL

    # Then drop the chore_chart_users table
    drop_table :chore_chart_users
  end

  def down
    create_table :chore_chart_users do |t|
      t.references :chore_chart, null: false, foreign_key: true
      t.string :name
      t.string :email
      t.references :user, foreign_key: true
      t.integer :position, null: false

      t.timestamps
    end

    add_index :chore_chart_users, [:chore_chart_id, :position], unique: true
  end
end 