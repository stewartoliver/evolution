class AddProfileFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    # Financial preferences
    add_column :users, :default_currency, :string, default: "NZD"
    add_column :users, :monthly_budget_target, :decimal, precision: 15, scale: 2
    add_column :users, :savings_target_percentage, :decimal, precision: 5, scale: 2
    
    # Fitness preferences
    add_column :users, :workout_days_per_week, :integer
    add_column :users, :preferred_workout_time, :string
    add_column :users, :fitness_level, :integer, default: 0
    add_column :users, :injury_restrictions, :text
    
    # Health and wellness
    add_column :users, :medical_conditions, :text
    add_column :users, :allergies, :text
    add_column :users, :medications, :text
    add_column :users, :blood_type, :string
    add_column :users, :emergency_contact_name, :string
    add_column :users, :emergency_contact_phone, :string
    
    # Goals and preferences
    add_column :users, :primary_fitness_goal, :string
    add_column :users, :primary_financial_goal, :string
    add_column :users, :notification_preferences, :jsonb, default: {}
    add_column :users, :time_zone, :string
    add_column :users, :language_preference, :string, default: "en"
  end
end 