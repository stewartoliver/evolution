class CreateStores < ActiveRecord::Migration[7.1]
  def change
    create_table :stores do |t|
      t.string :name, null: false
      t.string :chain_name
      t.json :metadata

      t.timestamps
    end
  end
end
