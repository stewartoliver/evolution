class CreateUserStores < ActiveRecord::Migration[7.1]
  def change
    create_table :user_stores do |t|
      t.references :user, null: false, foreign_key: true
      t.references :store, null: false, foreign_key: true
      t.string :custom_name

      t.timestamps
    end
  end
end
