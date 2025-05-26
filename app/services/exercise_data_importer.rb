class ExerciseDataImporter
  def self.import(json_file_path)
    new(json_file_path).import
  end

  def initialize(json_file_path)
    @data = JSON.parse(File.read(json_file_path))
    @muscle_cache = {}
    @muscle_group_cache = {}
    @equipment_cache = {}
    @exercise_type_cache = {}
  end

  def import
    ActiveRecord::Base.transaction do
      import_exercise_types
      import_muscles
      import_muscle_groups
      import_equipment
      import_exercises
    end
  end

  private

  def import_exercise_types
    puts "Importing exercise types..."
    @data['categories'].each do |type_name|
      exercise_type = ExerciseType.find_or_create_by!(name: type_name)
      @exercise_type_cache[type_name] = exercise_type
      puts "  - Created/Found exercise type: #{type_name}"
    end
    puts "Completed importing #{@exercise_type_cache.size} exercise types"
  end

  def import_muscles
    puts "Importing muscles..."
    @data['muscles'].each do |muscle_name|
      @muscle_cache[muscle_name] = Muscle.find_or_create_by!(name: muscle_name)
      puts "  - Created/Found muscle: #{muscle_name}"
    end
    puts "Completed importing #{@muscle_cache.size} muscles"
  end

  def import_muscle_groups
    puts "Importing muscle groups..."
    @data['muscle_groups'].each do |group_name, muscle_names|
      group = MuscleGroup.find_or_create_by!(name: group_name)
      @muscle_group_cache[group_name] = group
      puts "  - Created/Found muscle group: #{group_name}"

      # Clear existing muscle associations
      group.muscle_group_muscles.destroy_all

      # Add muscles to the group
      muscle_names.each_with_index do |muscle_name, index|
        muscle = @muscle_cache[muscle_name]
        next unless muscle # Skip if muscle wasn't found

        group.muscle_group_muscles.create!(
          muscle: muscle,
          primary_order: index
        )
        puts "    - Added muscle: #{muscle_name} to group"
      end
    end
    puts "Completed importing #{@muscle_group_cache.size} muscle groups"
  end

  def import_equipment
    puts "Importing equipment..."
    @data['equipment'].each do |equipment_name|
      @equipment_cache[equipment_name] = Equipment.find_or_create_by!(name: equipment_name)
      puts "  - Created/Found equipment: #{equipment_name}"
    end
    puts "Completed importing #{@equipment_cache.size} equipment items"
  end

  def import_exercises
    puts "Importing exercises..."
    @data['exercises'].each do |exercise_data|
      # Find or create the exercise
      exercise = Exercise.find_or_initialize_by(name: exercise_data['name'])
      puts "  - Processing exercise: #{exercise_data['name']}"
      
      # Get the exercise type
      exercise_type = @exercise_type_cache[exercise_data['category']]
      unless exercise_type
        puts "    ! Skipping exercise - category not found: #{exercise_data['category']}"
        next
      end

      # Determine primary muscle group based on first primary muscle
      primary_muscle_name = exercise_data['primary_muscles']&.first
      unless primary_muscle_name
        puts "    ! Skipping exercise - no primary muscles found"
        next
      end

      primary_muscle = @muscle_cache[primary_muscle_name]
      unless primary_muscle
        puts "    ! Skipping exercise - primary muscle not found: #{primary_muscle_name}"
        next
      end

      # Find the muscle group that contains this muscle
      muscle_group = primary_muscle.muscle_groups.first
      unless muscle_group
        puts "    ! Skipping exercise - no muscle group found for primary muscle: #{primary_muscle_name}"
        next
      end

      # Update basic attributes
      exercise.assign_attributes(
        exercise_type: exercise_type,
        description: exercise_data['description'],
        aliases: exercise_data['aliases'] || [],
        instructions: exercise_data['instructions'] || [],
        tips: exercise_data['tips'] || [],
        tempo: exercise_data['tempo'],
        images: exercise_data['images'] || [],
        video: exercise_data['video'],
        variation_on: exercise_data['variation_on'] || [],
        license_author: exercise_data['license_author'],
        license: exercise_data['license'] || {},
        added_by_id: 1,
        approved_by_id: 1,
        muscle_group_id: muscle_group.id
      )

      # Save the exercise first
      exercise.save!

      # Clear existing associations
      exercise.exercise_muscles.destroy_all
      exercise.exercise_equipment.destroy_all

      # Add primary muscles
      (exercise_data['primary_muscles'] || []).each_with_index do |muscle_name, index|
        muscle = @muscle_cache[muscle_name]
        next unless muscle # Skip if muscle wasn't found

        exercise.exercise_muscles.create!(
          muscle: muscle,
          muscle_type: 'primary',
          importance_order: index
        )
        puts "    - Added primary muscle: #{muscle_name}"
      end

      # Add secondary muscles
      (exercise_data['secondary_muscles'] || []).each_with_index do |muscle_name, index|
        muscle = @muscle_cache[muscle_name]
        next unless muscle # Skip if muscle wasn't found

        exercise.exercise_muscles.create!(
          muscle: muscle,
          muscle_type: 'secondary',
          importance_order: index
        )
        puts "    - Added secondary muscle: #{muscle_name}"
      end

      # Add equipment
      (exercise_data['equipment'] || []).each do |equipment_name|
        equipment = @equipment_cache[equipment_name]
        next unless equipment # Skip if equipment wasn't found

        exercise.exercise_equipment.create!(equipment: equipment)
        puts "    - Added equipment: #{equipment_name}"
      end

      puts "    ✓ Saved exercise successfully"
    end
    puts "Completed importing exercises"
  end
end 