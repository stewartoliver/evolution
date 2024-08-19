class CreateFinancialTags < ActiveRecord::Migration[7.1]
  def change
    create_table :financial_tags do |t|
      t.string :name, null: false
      t.bigint :user_id, null: false

      t.timestamps
    end

    add_index :financial_tags, :user_id
  end
end
