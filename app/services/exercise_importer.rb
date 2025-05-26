class ExerciseImporter
  def self.import(json_data)
    new(json_data).import
  end

  def initialize(json_data)
    @json_data = json_data
  end

  def import
    ActiveRecord::Base.transaction do
      import_muscles
      import_muscle_groups
      import_equipment
      import_exercises
    end
  end

  private

  def import_muscles
    @json_data['muscles'].each do |muscle_name|
      Muscle.find_or_create_by!(name: muscle_name)
    end
  end

  def import_muscle_groups
    @json_data['muscle_groups'].each do |group_name, muscle_names|
      group = MuscleGroup.find_or_create_by!(name: group_name)
      
      muscle_names.each do |muscle_name|
        muscle = Muscle.find_by!(name: muscle_name)
        MuscleGroupMuscle.find_or_create_by!(
          muscle_group: group,
          muscle: muscle
        )
      end
    end
  end

  def import_equipment
    @json_data['equipment'].each do |equipment_name|
      Equipment.find_or_create_by!(name: equipment_name)
    end
  end

  def import_exercises
    @json_data['exercises'].each do |exercise_data|
      exercise = Exercise.create!(
        name: exercise_data['name'],
        description: exercise_data['description'],
        aliases: exercise_data['aliases'],
        instructions: exercise_data['instructions'],
        tips: exercise_data['tips'],
        tempo: exercise_data['tempo'],
        images: exercise_data['images'],
        video: exercise_data['video'],
        variation_on: exercise_data['variation_on'],
        license_author: exercise_data['license_author'],
        license: exercise_data['license']
      )

      # Add primary muscles
      exercise_data['primary_muscles'].each do |muscle_name|
        muscle = Muscle.find_by!(name: muscle_name)
        ExerciseMuscle.create!(
          exercise: exercise,
          muscle: muscle,
          muscle_type: 'primary'
        )
      end

      # Add secondary muscles
      exercise_data['secondary_muscles'].each do |muscle_name|
        muscle = Muscle.find_by!(name: muscle_name)
        ExerciseMuscle.create!(
          exercise: exercise,
          muscle: muscle,
          muscle_type: 'secondary'
        )
      end

      # Add equipment
      exercise_data['equipment'].each do |equipment_name|
        equipment = Equipment.find_by!(name: equipment_name)
        ExerciseEquipment.create!(
          exercise: exercise,
          equipment: equipment
        )
      end
    end
  end
end 