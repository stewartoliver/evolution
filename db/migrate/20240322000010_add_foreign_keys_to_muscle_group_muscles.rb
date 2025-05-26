class AddForeignKeysToMuscleGroupMuscles < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :muscle_group_muscles, :muscle_groups
    add_foreign_key :muscle_group_muscles, :muscles
  end
end 