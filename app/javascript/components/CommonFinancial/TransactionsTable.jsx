import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Tag,
  DollarSign,
} from "lucide-react";

const TransactionsTable = ({ initialTransactions = [], accounts = [] }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterType, setFilterType] = useState("all"); // 'all', 'income', 'expense'
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  // Filter transactions based on search term, type, and account
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.category?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesType =
      filterType === "all" ||
      (filterType === "income" && transaction.transaction_type === "income") ||
      (filterType === "expense" && transaction.transaction_type === "expense");

    const matchesAccount =
      selectedAccount === "all" ||
      transaction.account_id.toString() === selectedAccount;

    return matchesSearch && matchesType && matchesAccount;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle nested fields
    if (sortField === "category") {
      aValue = a.category?.name || "";
      bValue = b.category?.name || "";
    } else if (sortField === "reference") {
      aValue = a.reference?.name || "";
      bValue = b.reference?.name || "";
    }

    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    if (sortField === "amount") {
      return sortDirection === "asc"
        ? parseFloat(aValue) - parseFloat(bValue)
        : parseFloat(bValue) - parseFloat(aValue);
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="size-4 text-text-light dark:text-text-dark"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
          />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="size-4 text-text-light dark:text-text-dark"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="size-4 text-text-light dark:text-text-dark"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-background-card dark:bg-background-card-dark rounded-md">
        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-md border border-gray-300 whitespace-nowrap dark:border-gray-600 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-md border border-gray-300 whitespace-nowrap dark:border-gray-600 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.account_name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-background-card dark:bg-background-card-dark">
            <tr>
              <th
                onClick={() => handleSort("date")}
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <span>{getSortIcon("date")}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort("reference")}
                className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Reference</span>
                  <span>{getSortIcon("reference")}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort("description")}
                className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Description</span>
                  <span>{getSortIcon("description")}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort("category")}
                className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <span>{getSortIcon("category")}</span>
                </div>
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider cursor-pointer hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <span>{getSortIcon("amount")}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-background-light dark:bg-background-dark divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.length > 0 ? (
              currentItems.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-background-card-light dark:hover:bg-background-card-dark transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                    {format(new Date(transaction.date), "d MMM, yyyy")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                    {transaction.reference || ""}
                  </td>
                  <td className="px-4 py-4 text-sm text-text-light dark:text-text-dark">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                    {transaction.category?.name || ""}
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.amount >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.amount >= 0 ? "+" : ""}
                    {transaction.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "NZD",
                    })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`../finances/transactions/${transaction.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No transactions found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="flex justify-between items-center px-4 py-3 bg-background-card dark:bg-background-card-dark rounded-md">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                currentPage * itemsPerPage,
                filteredTransactions.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredTransactions.length}</span>{" "}
            results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-background-hover dark:hover:bg-background-hover-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-background-hover dark:hover:bg-background-hover-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
