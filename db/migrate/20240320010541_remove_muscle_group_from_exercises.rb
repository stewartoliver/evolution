class RemoveMuscleGroupFromExercises < ActiveRecord::Migration[7.1]
  def change
    remove_column :exercises, :muscle_group, :string
  end
end
