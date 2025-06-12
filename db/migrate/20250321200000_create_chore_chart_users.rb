class CreateChoreChartUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :chore_chart_users do |t|
      t.references :chore_chart, null: false, foreign_key: true
      t.references :user, null: true, foreign_key: true
      t.string :name, null: false
      t.string :email
      t.integer :position, null: false
      t.timestamps
    end

    add_index :chore_chart_users, [:chore_chart_id, :position], unique: true
  end
end 