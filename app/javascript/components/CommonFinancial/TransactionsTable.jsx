import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TransactionsTable = ({ initialTransactions = [], accounts = [] }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  // Filter transactions based on search term, type, and account
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      filterType === 'all' ||
      (filterType === 'income' && transaction.transaction_type === 'income') ||
      (filterType === 'expense' && transaction.transaction_type === 'expense');
    
    const matchesAccount = 
      selectedAccount === 'all' ||
      transaction.account_id.toString() === selectedAccount;

    return matchesSearch && matchesType && matchesAccount;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }
    
    if (sortField === 'amount') {
      return sortDirection === 'asc'
        ? parseFloat(aValue) - parseFloat(bValue)
        : parseFloat(bValue) - parseFloat(aValue);
    }

    return sortDirection === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 whitespace-nowrap dark:border-gray-600 bg-background-light dark:bg-background-dark"
        >
          <option value="all">All Types</option>
          <option value="income">Income Only</option>
          <option value="expense">Expense Only</option>
        </select>

        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 whitespace-nowrap dark:border-gray-600 bg-background-light dark:bg-background-dark"
        >
          <option value="all" className="pr-2">All Accounts</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.account_name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-background-card dark:bg-background-card-dark">
            <tr>
              <th 
                onClick={() => handleSort('date')}
                className="px-6 py-3 text-left text-xs font-medium text-text-sub dark:text-text-sub-dark uppercase tracking-wider cursor-pointer"
              >
                Date {getSortIcon('date')}
              </th>
              <th 
                onClick={() => handleSort('description')}
                className="px-6 py-3 text-left text-xs font-medium text-text-sub dark:text-text-sub-dark uppercase tracking-wider cursor-pointer"
              >
                Description {getSortIcon('description')}
              </th>
              <th 
                onClick={() => handleSort('category')}
                className="px-6 py-3 text-left text-xs font-medium text-text-sub dark:text-text-sub-dark uppercase tracking-wider cursor-pointer"
              >
                Category {getSortIcon('category')}
              </th>
              <th 
                onClick={() => handleSort('amount')}
                className="px-6 py-3 text-left text-xs font-medium text-text-sub dark:text-text-sub-dark uppercase tracking-wider cursor-pointer"
              >
                Amount {getSortIcon('amount')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-sub dark:text-text-sub-dark uppercase tracking-wider">
                Account
              </th>
            </tr>
          </thead>
          <tbody className="bg-background-light dark:bg-background-dark divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-background-hover dark:hover:bg-background-hover-dark">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {transaction.category?.name || 'Uncategorized'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  transaction.transaction_type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.transaction_type === 'income' ? '+' : ''}
                  {transaction.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'NZD'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {transaction.account?.account_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable; 