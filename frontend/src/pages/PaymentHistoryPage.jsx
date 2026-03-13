import React, { useState, useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, Wallet, IndianRupee, Calendar, User, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import walletService from "../api/walletService";

export default function PaymentHistoryPage() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); 

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

  const getTransactionColor = (type) => {
    return type === 'credit' 
      ? 'text-pastel-mint-dark' 
      : 'text-pastel-pink-dark';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pastel-cream p-4">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-pastel-lavender-dark mx-auto" size={40} strokeWidth={3} />
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Syncing Economy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-cream p-4 md:p-8 font-[Poppins] relative overflow-x-hidden pb-20">
      {/* Background Blooms */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-pastel-peach-light/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pastel-mint-light/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Financial Flow</h1>
            <p className="text-slate-500 mt-2 font-medium italic pr-4">Documenting your economic odyssey within the pastel grid</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {[ 
              { id: 'all', label: 'Universal', icon: RefreshCw },
              { id: 'credit', label: 'Yields', icon: ArrowDownCircle },
              { id: 'debit', label: 'Outflow', icon: ArrowUpCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-3 border ${
                  filter === tab.id
                    ? 'bg-slate-800 text-white border-slate-700 shadow-xl'
                    : 'bg-white text-slate-400 hover:text-slate-600 border-white'
                }`}
              >
                <tab.icon size={16} strokeWidth={3} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender rounded-[3rem] p-10 md:p-14 text-slate-800 shadow-xl shadow-pastel-lavender/20 border-4 border-white relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mb-32 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3 opacity-60">
                <Wallet size={32} strokeWidth={2.5} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em]">Quantum Liquidity</h2>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-black opacity-40 tabular-nums uppercase">₹</span>
                <span className="text-6xl md:text-8xl font-black tracking-tighter tabular-nums drop-shadow-md">
                  {wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="pt-4 flex flex-wrap gap-6">
                <div className="px-5 py-2.5 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 text-[9px] font-black uppercase tracking-widest">
                  Verified Assets
                </div>
                <div className="px-5 py-2.5 bg-pastel-mint/40 backdrop-blur-md rounded-2xl border border-white/40 text-[9px] font-black uppercase tracking-widest text-slate-800">
                  Ready for Pulse
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 grid gap-6">
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border-2 border-white shadow-pastel-shadow">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Accrued</h3>
              <div className="flex items-baseline gap-2 text-pastel-mint-dark">
                <span className="text-3xl font-black tabular-nums">₹</span>
                <span className="text-4xl font-black tracking-tighter">
                  {transactions
                    .filter(t => t.type === 'credit')
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border-2 border-white shadow-pastel-shadow">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Expended</h3>
              <div className="flex items-baseline gap-2 text-pastel-pink-dark">
                <span className="text-3xl font-black tabular-nums text-pastel-pink-dark">₹</span>
                <span className="text-4xl font-black tracking-tighter">
                  {transactions
                    .filter(t => t.type === 'debit')
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-[3rem] p-6 md:p-12 shadow-pastel-shadow border-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-pastel-lavender/10">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Transaction Ledger</h3>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full border border-white">
              {transactions.length} Nodes
            </div>
          </div>

          {error && (
            <div className="bg-pastel-pink/30 border border-pastel-pink p-4 rounded-2xl mb-8 flex items-center gap-3 text-red-800 text-xs font-bold uppercase tracking-widest">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {transactions.length === 0 ? (
            <div className="text-center py-20 bg-white/20 rounded-[2rem] border-2 border-dashed border-white">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6 shadow-inner">
                <Wallet size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Static Ledger</h3>
              <p className="text-slate-500 text-xs font-medium mt-2">Zero fiscal activity detected in this cycle</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction._id || index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 md:p-8 bg-white/40 border-2 border-white rounded-[2.5rem] hover:bg-white hover:shadow-md transition-all group/node"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className={`p-4 rounded-2xl shadow-inner border border-white shadow-sm transition-transform duration-500 group-hover/node:scale-110 ${
                      transaction.type === 'credit' ? 'bg-pastel-mint-light/40 text-pastel-mint-dark' : 'bg-pastel-pink-light/40 text-pastel-pink-dark'
                    }`}>
                      {transaction.type === 'credit' ? <ArrowDownCircle size={28} strokeWidth={2.5} /> : <ArrowUpCircle size={28} strokeWidth={2.5} />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-black text-slate-800 text-lg tracking-tight group-hover/node:text-pastel-lavender-dark transition-colors">
                        {transaction.description}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-xl border border-white">
                          <Calendar size={12} className="text-pastel-lavender-dark" />
                          {formatDate(transaction.transactionDate)}
                        </div>
                        {transaction.relatedUserId && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-xl border border-white">
                            <User size={12} className="text-pastel-mint-dark" />
                            {transaction.relatedUserId.name || 'External User'}
                          </div>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-xl border border-white">
                           <span className="text-slate-300">Hash</span> #{(transaction._id || '').slice(-8)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl md:text-4xl font-black transition-all tabular-nums ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
