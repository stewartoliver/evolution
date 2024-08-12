class AddDetailsToUsers < ActiveRecord::Migration[7.1]
  def change
   add_column :users, :first_name, :string
   add_column :users, :last_name, :string
   add_column :users, :date_of_birth, :date
   add_column :users, :height, :decimal, precision: 5, scale: 2
   add_column :users, :gender, :string
   add_column :users, :activity_level, :integer, default: 0
   add_column :users, :current_calorie_intake, :decimal, precision: 5, scale: 2
   add_column :users, :target_calorie_intake, :decimal, precision: 5, scale: 2
   add_column :users, :bmi, :decimal, precision: 5, scale: 2
   add_column :users, :bmr, :decimal, precision: 5, scale: 2
   add_column :users, :body_fat_percentage, :decimal, precision: 5, scale: 2
   add_column :users, :goal_weight, :decimal, precision: 5, scale: 2
   add_column :users, :preferred_units, :string, default: "metric"
 end
end
