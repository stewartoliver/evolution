class RenameFinanceGoalsToFinancialGoals < ActiveRecord::Migration[7.1]
  def change
    rename_table :finance_goals, :financial_goals

    rename_column :financial_goals, :bank_account_id, :account_id

    remove_column :financial_goals, :goal_type
  end
end
