# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_08_08_062819) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "account_name"
    t.string "account_type"
    t.decimal "balance", precision: 15, scale: 2
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_accounts_on_user_id"
  end

  create_table "achievements", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "goal_id", null: false
    t.string "description"
    t.datetime "achieved_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["goal_id"], name: "index_achievements_on_goal_id"
    t.index ["user_id"], name: "index_achievements_on_user_id"
  end

  create_table "budgets", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "category"
    t.decimal "amount", precision: 15, scale: 2
    t.datetime "start_date"
    t.datetime "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_budgets_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "category_type", default: "expense", null: false
  end

  create_table "exercise_types", force: :cascade do |t|
    t.string "name"
    t.string "color"
    t.string "icon"
    t.text "description"
  end

  create_table "exercises", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "added_by_id"
    t.datetime "approved_at"
    t.integer "approved_by_id"
    t.bigint "exercise_type_id", null: false
    t.bigint "muscle_group_id", null: false
    t.index ["exercise_type_id"], name: "index_exercises_on_exercise_type_id"
    t.index ["muscle_group_id"], name: "index_exercises_on_muscle_group_id"
  end

  create_table "expenses", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.decimal "amount", precision: 15, scale: 2
    t.string "sub_category"
    t.string "description"
    t.datetime "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "recurring", default: false
    t.string "frequency"
    t.date "next_occurrence"
    t.date "end_date"
    t.integer "category_id"
    t.bigint "store_id"
    t.integer "custom_frequency"
    t.string "frequency_unit"
    t.integer "day_of_week"
    t.integer "day_of_month"
    t.integer "user_id"
    t.string "name"
    t.index ["account_id"], name: "index_expenses_on_account_id"
    t.index ["store_id"], name: "index_expenses_on_store_id"
    t.index ["user_id"], name: "index_expenses_on_user_id"
  end

  create_table "fitness_log_entries", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "date", null: false
    t.bigint "routine_id"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.time "time"
    t.index ["routine_id"], name: "index_fitness_log_entries_on_routine_id"
    t.index ["user_id"], name: "index_fitness_log_entries_on_user_id"
  end

  create_table "fitness_log_exercises", force: :cascade do |t|
    t.bigint "fitness_log_entry_id", null: false
    t.bigint "exercise_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["exercise_id"], name: "index_fitness_log_exercises_on_exercise_id"
    t.index ["fitness_log_entry_id"], name: "index_fitness_log_exercises_on_fitness_log_entry_id"
  end

  create_table "fitness_log_sets", force: :cascade do |t|
    t.bigint "fitness_log_exercise_id", null: false
    t.integer "reps"
    t.integer "weight"
    t.integer "duration"
    t.integer "distance"
    t.string "intensity"
    t.decimal "speed"
    t.integer "laps"
    t.string "style"
    t.string "muscle_groups"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["fitness_log_exercise_id"], name: "index_fitness_log_sets_on_fitness_log_exercise_id"
  end

  create_table "goals", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "title", null: false
    t.text "description"
    t.date "start_date"
    t.date "end_date"
    t.integer "progress", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_favourite", default: false
    t.string "status", default: "not started"
    t.bigint "parent_goal_id"
    t.datetime "completed_at"
    t.integer "generation", default: 0
    t.index ["parent_goal_id"], name: "index_goals_on_parent_goal_id"
    t.index ["user_id"], name: "index_goals_on_user_id"
  end

  create_table "incomes", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.decimal "amount", precision: 15, scale: 2
    t.string "source"
    t.datetime "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_incomes_on_account_id"
  end

  create_table "muscle_groups", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "routine_exercises", force: :cascade do |t|
    t.bigint "routine_id", null: false
    t.bigint "exercise_id", null: false
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["exercise_id"], name: "index_routine_exercises_on_exercise_id"
    t.index ["routine_id"], name: "index_routine_exercises_on_routine_id"
  end

  create_table "routine_sets", force: :cascade do |t|
    t.bigint "routine_exercise_id", null: false
    t.integer "reps"
    t.decimal "weight"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "duration"
    t.integer "distance"
    t.string "intensity"
    t.decimal "speed"
    t.integer "laps"
    t.string "style"
    t.index ["routine_exercise_id"], name: "index_routine_sets_on_routine_exercise_id"
  end

  create_table "routines", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "user_id"
    t.datetime "approved_at"
    t.integer "approved_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "stores", force: :cascade do |t|
    t.string "name", null: false
    t.string "chain_name"
    t.json "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tasks", force: :cascade do |t|
    t.bigint "goal_id", null: false
    t.string "title", null: false
    t.text "description"
    t.datetime "due_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", default: 0, null: false
    t.integer "priority"
    t.datetime "completed_at"
    t.integer "assigned_to"
    t.decimal "estimated_time"
    t.decimal "actual_time"
    t.string "tags"
    t.boolean "is_recurring"
    t.string "recurrence_interval"
    t.integer "user_id"
    t.index ["goal_id"], name: "index_tasks_on_goal_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.string "transaction_type"
    t.decimal "amount", precision: 15, scale: 2
    t.string "description"
    t.datetime "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_transactions_on_account_id"
  end

  create_table "user_stores", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "store_id", null: false
    t.string "custom_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["store_id"], name: "index_user_stores_on_store_id"
    t.index ["user_id"], name: "index_user_stores_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "operator", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "accounts", "users"
  add_foreign_key "achievements", "goals"
  add_foreign_key "achievements", "users"
  add_foreign_key "budgets", "users"
  add_foreign_key "exercises", "exercise_types"
  add_foreign_key "exercises", "muscle_groups"
  add_foreign_key "expenses", "accounts"
  add_foreign_key "expenses", "categories"
  add_foreign_key "expenses", "stores"
  add_foreign_key "fitness_log_entries", "routines"
  add_foreign_key "fitness_log_entries", "users"
  add_foreign_key "fitness_log_exercises", "exercises"
  add_foreign_key "fitness_log_exercises", "fitness_log_entries"
  add_foreign_key "fitness_log_sets", "fitness_log_exercises"
  add_foreign_key "goals", "goals", column: "parent_goal_id"
  add_foreign_key "goals", "users"
  add_foreign_key "incomes", "accounts"
  add_foreign_key "routine_exercises", "exercises"
  add_foreign_key "routine_exercises", "routines"
  add_foreign_key "routine_sets", "routine_exercises"
  add_foreign_key "tasks", "goals"
  add_foreign_key "transactions", "accounts"
  add_foreign_key "user_stores", "stores"
  add_foreign_key "user_stores", "users"
end
