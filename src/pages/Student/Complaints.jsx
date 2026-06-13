import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import { format } from 'date-fns';
import { PlusCircle, MessageSquare } from 'lucide-react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'maintenance', priority: 'normal' });
  const { addToast } = useStore();

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      addToast('Complaint submitted successfully', 'success');
      setShowModal(false);
      setFormData({ title: '', description: '', category: 'maintenance', priority: 'normal' });
      fetchComplaints();
    } catch (error) {
      addToast(error.response?.data?.message || 'Error submitting complaint', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'open': return <span className="bg-red-100 text-alert-red px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">Open</span>;
      case 'in-progress': return <span className="bg-yellow-100 text-warning-yellow px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">In Progress</span>;
      case 'resolved': return <span className="bg-green-100 text-accent-green px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">Resolved</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Complaints</h1>
          <p className="text-gray-500 mt-1">Track and file new complaints related to your room or hostel</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <PlusCircle size={18} /> File New Complaint
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div>Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">You haven't filed any complaints yet.</p>
          </div>
        ) : (
          complaints.map(c => (
            <div key={c._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-800">{c.title}</h3>
                    {getStatusBadge(c.status)}
                    {c.priority === 'urgent' && <span className="bg-red-50 border border-red-200 text-alert-red px-2 py-0.5 rounded text-xs font-bold uppercase">Urgent</span>}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="capitalize">{c.category}</span> • {format(new Date(c.createdAt), 'dd MMM yyyy, p')}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">{c.description}</p>
              
              {c.wardenResponse && (
                <div className="mt-4 flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <MessageSquare size={18} className="text-primary-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-primary-blue mb-1">Warden's Response</p>
                    <p className="text-sm text-gray-800">{c.wardenResponse}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">File a Complaint</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="E.g. Leaking tap in bathroom"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none bg-white"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="hygiene">Hygiene</option>
                    <option value="noise">Noise</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none bg-white"
                    value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  required rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide details about the issue..."
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-blue text-white font-medium hover:bg-blue-800 rounded-lg transition-colors shadow-sm">Submit Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
