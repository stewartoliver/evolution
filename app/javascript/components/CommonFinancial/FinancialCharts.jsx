import React from 'react';
import { LineChart, PieChart } from 'react-chartkick';

const FinancialCharts = ({ transactions, categories }) => {
  // Calculate monthly spending by category
  const getMonthlySpendingByCategory = () => {
    const monthlyData = {};
    const currentDate = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7); // Format: YYYY-MM
    }).reverse();

    // Initialize data structure
    last6Months.forEach(month => {
      monthlyData[month] = {};
      categories.forEach(category => {
        monthlyData[month][category.name] = 0;
      });
    });

    // Calculate spending
    transactions.forEach(transaction => {
      if (transaction.amount < 0) { // Only count expenses
        const month = transaction.date.slice(0, 7);
        const category = categories.find(c => c.id === transaction.category_id);
        if (category && monthlyData[month]) {
          monthlyData[month][category.name] += Math.abs(transaction.amount);
        }
      }
    });

    return monthlyData;
  };

  // Calculate total spending by category
  const getTotalSpendingByCategory = () => {
    const categoryTotals = {};
    categories.forEach(category => {
      categoryTotals[category.name] = 0;
    });

    transactions.forEach(transaction => {
      if (transaction.amount < 0) { // Only count expenses
        const category = categories.find(c => c.id === transaction.category_id);
        if (category) {
          categoryTotals[category.name] += Math.abs(transaction.amount);
        }
      }
    });

    // Remove categories with zero spending
    Object.keys(categoryTotals).forEach(category => {
      if (categoryTotals[category] === 0) {
        delete categoryTotals[category];
      }
    });

    return categoryTotals;
  };

  // Calculate monthly income vs expenses
  const getMonthlyIncomeVsExpenses = () => {
    const monthlyData = {};
    const currentDate = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7); // Format: YYYY-MM
    }).reverse();

    // Initialize data structure
    last6Months.forEach(month => {
      monthlyData[month] = {
        Income: 0,
        Expenses: 0
      };
    });

    // Calculate income and expenses
    transactions.forEach(transaction => {
      const month = transaction.date.slice(0, 7);
      if (monthlyData[month]) {
        if (transaction.amount > 0) {
          monthlyData[month].Income += transaction.amount;
        } else {
          monthlyData[month].Expenses += Math.abs(transaction.amount);
        }
      }
    });

    return monthlyData;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Income vs Expenses */}
      <div className="bg-background-card dark:bg-background-card-dark p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
          Monthly Income vs Expenses
        </h3>
        <LineChart
          data={getMonthlyIncomeVsExpenses()}
          xtitle="Month"
          ytitle="Amount"
          legend={true}
          colors={["#10B981", "#EF4444"]}
          height="300px"
        />
      </div>

      {/* Spending by Category */}
      <div className="bg-background-card dark:bg-background-card-dark p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
          Spending by Category
        </h3>
        <PieChart
          data={getTotalSpendingByCategory()}
          legend={true}
          height="300px"
        />
      </div>

      {/* Monthly Spending by Category */}
      <div className="bg-background-card dark:bg-background-card-dark p-4 rounded-lg shadow md:col-span-2">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
          Monthly Spending by Category
        </h3>
        <LineChart
          data={getMonthlySpendingByCategory()}
          xtitle="Month"
          ytitle="Amount"
          legend={true}
          height="300px"
        />
      </div>
    </div>
  );
};

export default FinancialCharts; 