class CreateChoreRotationUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :chore_rotation_users do |t|
      t.references :chore_rotation, null: false, foreign_key: true
      t.string :name, null: false
      t.string :email
      t.references :user, foreign_key: true, null: true
      t.integer :position, null: false

      t.timestamps
    end

    add_index :chore_rotation_users, [:chore_rotation_id, :position], unique: true
  end
end 