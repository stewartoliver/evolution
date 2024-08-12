class CreateUserWeightHistories < ActiveRecord::Migration[7.1]
  def change
    create_table :user_weight_histories do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :weight, precision: 5, scale: 2
      t.datetime :recorded_at, null: false
      t.text :note

      t.timestamps
    end
  end
end
