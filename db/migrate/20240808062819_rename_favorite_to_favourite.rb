class RenameFavoriteToFavourite < ActiveRecord::Migration[7.1]
  def change
    rename_column :goals, :is_favorite, :is_favourite
  end
end
