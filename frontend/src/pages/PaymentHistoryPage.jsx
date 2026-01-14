import React, { useState, useEffect } from 'react';
import { Download, Filter, Search } from 'lucide-react';
import { paymentService } from '../api/paymentService';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [type, setType] = useState('passenger');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPaymentData();
  }, [type]);

  const fetchPaymentData = async () => {
    setLoading(true);
    setError('');
    try {
      const [historyRes, statsRes] = await Promise.all([
        paymentService.getPaymentHistory(type),
        paymentService.getPaymentStats(),
      ]);

      setPayments(historyRes.data.data || []);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load payment history'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      card: '💳',
      upi: '📱',
      wallet: '👛',
      net_banking: '🏦',
    };
    return icons[method] || '💰';
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      statusFilter === 'all' || payment.status === statusFilter;
    const matchesSearch =
      payment.ride?.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.ride?.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDownloadInvoice = (payment) => {
    // Generate invoice data
    const invoiceData = `
RIDE POOLING INVOICE
====================
Transaction ID: ${payment.transactionId}
Date: ${new Date(payment.createdAt).toLocaleDateString()}

Route: ${payment.ride?.source} → ${payment.ride?.destination}
Amount: ₹${payment.amount}
Status: ${payment.status.toUpperCase()}
Payment Method: ${payment.paymentMethod.toUpperCase()}

${payment.status === 'refunded' ? `Refund Amount: ₹${payment.amount}\n` : ''}
    `;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceData)
    );
    element.setAttribute(
      'download',
      `invoice_${payment.transactionId}.txt`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>Payment History</h1>

        {/* Stats Cards */}
        {stats && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            {type === 'driver' ? (
              <>
                <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600'>
                  <p className='text-gray-600 text-sm font-semibold'>Total Earnings</p>
                  <p className='text-3xl font-bold text-green-600 mt-2'>
                    ₹{stats.driverEarnings?.totalEarnings || 0}
                  </p>
                  <p className='text-gray-600 text-sm mt-2'>
                    {stats.driverEarnings?.completedRides || 0} completed rides
                  </p>
                </div>
                <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600'>
                  <p className='text-gray-600 text-sm font-semibold'>
                    Average per Ride
                  </p>
                  <p className='text-3xl font-bold text-blue-600 mt-2'>
                    ₹{stats.driverEarnings?.averagePerRide || 0}
                  </p>
                </div>
                <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600'>
                  <p className='text-gray-600 text-sm font-semibold'>
                    Total Transactions
                  </p>
                  <p className='text-3xl font-bold text-purple-600 mt-2'>
                    {payments.length}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600'>
                  <p className='text-gray-600 text-sm font-semibold'>Total Spent</p>
                  <p className='text-3xl font-bold text-red-600 mt-2'>
                    ₹{stats.passengerSpending?.totalSpent || 0}
                  </p>
                  <p className='text-gray-600 text-sm mt-2'>
                    {stats.passengerSpending?.bookedRides || 0} rides booked
                  </p>
                </div>
                <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600'>
                  <p className='text-gray-600 text-sm font-semibold'>
                    Average per Ride
                  </p>
                  <p className='text-3xl font-bold text-blue-600 mt-2'>
                    ₹{stats.passengerSpending?.averagePerRide || 0}
                  </p>
                </div>
                <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600'>
                  <p className='text-gray-600 text-sm font-semibold'>
                    Total Bookings
                  </p>
                  <p className='text-3xl font-bold text-purple-600 mt-2'>
                    {payments.length}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Filters */}
        <div className='bg-white rounded-lg shadow-md p-4 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Type Toggle */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                View as
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='passenger'>Passenger (Bookings)</option>
                <option value='driver'>Driver (Earnings)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                <Filter size={16} className='inline mr-1' />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='all'>All</option>
                <option value='completed'>Completed</option>
                <option value='pending'>Pending</option>
                <option value='processing'>Processing</option>
                <option value='failed'>Failed</option>
                <option value='refunded'>Refunded</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                <Search size={16} className='inline mr-1' />
                Search
              </label>
              <input
                type='text'
                placeholder='Route or Transaction ID'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700'>
            {error}
          </div>
        )}

        {/* Transactions Table */}
        {filteredPayments.length > 0 ? (
          <div className='bg-white rounded-lg shadow-md overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-100 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                      Route
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                      Method
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className='hover:bg-gray-50 transition'
                    >
                      <td className='px-6 py-4 text-sm text-gray-800'>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 text-sm'>
                        <div className='text-gray-800 font-medium'>
                          {payment.ride?.source}
                        </div>
                        <div className='text-gray-500 text-xs'>
                          {payment.ride?.destination}
                        </div>
                      </td>
                      <td className='px-6 py-4 text-lg'>
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className='ml-2 text-sm text-gray-600 capitalize'>
                          {payment.paymentMethod}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm font-semibold text-gray-800'>
                        ₹{payment.amount}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                            payment.status
                          )}`}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <button
                          onClick={() => handleDownloadInvoice(payment)}
                          className='inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm'
                        >
                          <Download size={16} />
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-md p-8 text-center'>
            <p className='text-gray-500 text-lg'>
              No transactions found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
