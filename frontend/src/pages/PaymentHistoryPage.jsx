import React, { useState, useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, Wallet, IndianRupee, Calendar, User } from "lucide-react";
import walletService from "../api/walletService";

export default function PaymentHistoryPage() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, credit, debit

  useEffect(() => {
    fetchWalletData();
  }, [filter]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, transactionsRes] = await Promise.all([
        walletService.getWallet(),
        walletService.getTransactionHistory({ 
          type: filter === 'all' ? undefined : filter,
          limit: 100 
        })
      ]);

      if (walletRes.success) {
        setWallet(walletRes.data.wallet);
      }

      if (transactionsRes.success) {
        setTransactions(transactionsRes.data.transactions || []);
      }
    } catch (err) {
      console.error("Error fetching wallet data:", err);
      setError(err.response?.data?.message || "Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' 
      ? <ArrowDownCircle className="text-green-600" size={24} />
      : <ArrowUpCircle className="text-red-600" size={24} />;
  };

  const getTransactionColor = (type) => {
    return type === 'credit' 
      ? 'text-green-600' 
      : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Payment History</h1>
          <p className="text-slate-600">Track your earnings and spending</p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Wallet size={32} />
            <h2 className="text-2xl font-bold">Wallet Balance</h2>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee size={40} />
            <span className="text-6xl font-black">{wallet?.balance?.toFixed(2) || '0.00'}</span>
          </div>
          <p className="mt-4 text-indigo-100">Available for rides and withdrawals</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setFilter('credit')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              filter === 'credit'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Earnings
          </button>
          <button
            onClick={() => setFilter('debit')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              filter === 'debit'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Payments
          </button>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-4">
              {error}
            </div>
          )}

          {transactions.length === 0 ? (
            <div className="text-center py-16">
              <Wallet size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Transactions Yet</h3>
              <p className="text-slate-500">
                Your transaction history will appear here once you complete rides
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction._id || index}
                  className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-1">
                        {transaction.description}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(transaction.transactionDate)}
                        </div>
                        {transaction.relatedUserId && (
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {transaction.relatedUserId.name || 'User'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-black ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-green-50 rounded-3xl p-6 border-2 border-green-200">
              <h3 className="text-green-800 font-bold mb-2">Total Earnings</h3>
              <div className="flex items-center gap-2 text-green-600">
                <IndianRupee size={32} />
                <span className="text-4xl font-black">
                  {transactions
                    .filter(t => t.type === 'credit')
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
            <div className="bg-red-50 rounded-3xl p-6 border-2 border-red-200">
              <h3 className="text-red-800 font-bold mb-2">Total Spending</h3>
              <div className="flex items-center gap-2 text-red-600">
                <IndianRupee size={32} />
                <span className="text-4xl font-black">
                  {transactions
                    .filter(t => t.type === 'debit')
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
