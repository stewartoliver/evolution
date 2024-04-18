class RenameSetsToRoutineSets < ActiveRecord::Migration[7.1]
  def change
        rename_table :sets, :routine_sets
  end
end
