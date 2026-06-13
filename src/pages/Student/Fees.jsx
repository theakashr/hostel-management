import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import { Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const Fees = () => {
  const { user } = useStore();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get(`/fees/${user._id}`);
        setFees(res.data);
      } catch (error) {
        console.error('Error fetching fees', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [user._id]);

  if (loading) return <div>Loading fees...</div>;

  const currentDue = fees.filter(f => f.status !== 'paid').reduce((acc, f) => acc + f.amountDue, 0);
  const totalPaidThisYear = fees.filter(f => f.status === 'paid' && f.year === new Date().getFullYear()).reduce((acc, f) => acc + f.amountPaid, 0);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid': return <span className="inline-flex items-center gap-1 bg-green-100 text-accent-green px-2.5 py-0.5 rounded-full text-xs font-semibold"><CheckCircle size={12}/> Paid</span>;
      case 'pending': return <span className="inline-flex items-center gap-1 bg-yellow-100 text-warning-yellow px-2.5 py-0.5 rounded-full text-xs font-semibold"><Clock size={12}/> Pending</span>;
      case 'overdue': return <span className="inline-flex items-center gap-1 bg-red-100 text-alert-red px-2.5 py-0.5 rounded-full text-xs font-semibold"><AlertTriangle size={12}/> Overdue</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fee Details</h1>
        <p className="text-gray-500 mt-1">Track your monthly rent and miscellaneous fees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Current Dues</p>
            <h3 className="text-3xl font-bold text-alert-red">₹{currentDue}</h3>
          </div>
          <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentDue > 0 ? 'bg-primary-blue hover:bg-blue-800 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} disabled={currentDue === 0}>
            Pay Now
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Paid This Year</p>
            <h3 className="text-3xl font-bold text-accent-green">₹{totalPaidThisYear}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">Fee History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month / Year</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Due</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Paid</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No fee records found.</td></tr>
              ) : fees.map(fee => (
                <tr key={fee._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{fee.month} {fee.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₹{fee.amountDue}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₹{fee.amountPaid}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{format(new Date(fee.dueDate), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4">{getStatusBadge(fee.status)}</td>
                  <td className="px-6 py-4">
                    <button className="text-primary-blue hover:text-blue-800 flex items-center gap-1 text-sm font-medium transition-colors">
                      <Download size={16} /> Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fees;
