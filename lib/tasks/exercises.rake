namespace :exercises do
  desc "Import exercises from JSON file"
  task :import, [:file_path] => :environment do |t, args|
    file_path = args[:file_path] || 'db/data/exercises.json'
    
    puts "Starting import from #{file_path}..."
    ExerciseDataImporter.import(file_path)
    puts "Import completed successfully!"
  end
end 