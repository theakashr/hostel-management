import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '' });
  const { addToast } = useStore();

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves');
      setLeaves(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', formData);
      addToast('Leave request submitted', 'success');
      setShowModal(false);
      setFormData({ startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (error) {
      addToast(error.response?.data?.message || 'Error submitting request', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="bg-yellow-100 text-warning-yellow px-2 py-1 rounded text-xs font-semibold uppercase">Pending</span>;
      case 'approved': return <span className="bg-green-100 text-accent-green px-2 py-1 rounded text-xs font-semibold uppercase">Approved</span>;
      case 'rejected': return <span className="bg-red-100 text-alert-red px-2 py-1 rounded text-xs font-semibold uppercase">Rejected</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leave Requests</h1>
          <p className="text-gray-500 mt-1">Submit and track your hostel leave applications</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <PlusCircle size={18} /> Request Leave
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No leave requests found.</td></tr>
              ) : leaves.map(l => {
                const start = new Date(l.startDate);
                const end = new Date(l.endDate);
                const days = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
                return (
                  <tr key={l._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      {format(start, 'dd MMM')} - {format(end, 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{days} day(s)</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={l.reason}>{l.reason}</td>
                    <td className="px-6 py-4">{getStatusBadge(l.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(l.createdAt), 'dd MMM yyyy')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Request Leave</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input 
                    type="date" required min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                    value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input 
                    type="date" required min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                    value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for leave</label>
                <textarea 
                  required rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                  value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}
                  placeholder="Going home for holidays..."
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-blue text-white font-medium hover:bg-blue-800 rounded-lg transition-colors shadow-sm">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;
