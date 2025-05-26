class UpdateExercisesTable < ActiveRecord::Migration[7.1]
  def change
    add_column :exercises, :aliases, :text, array: true, default: []
    add_column :exercises, :instructions, :text, array: true, default: []
    add_column :exercises, :tips, :text, array: true, default: []
    add_column :exercises, :tempo, :string
    add_column :exercises, :images, :text, array: true, default: []
    add_column :exercises, :video, :string
    add_column :exercises, :variation_on, :text, array: true, default: []
    add_column :exercises, :license_author, :string
    add_column :exercises, :license, :jsonb
  end
end 