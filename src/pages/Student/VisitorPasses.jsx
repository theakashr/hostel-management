import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, PlusCircle, Download } from 'lucide-react';

const Passes = () => {
  const { user } = useStore();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ visitorName: '', visitorPhone: '', visitDate: '', visitTime: '', purpose: 'friend' });
  const { addToast } = useStore();

  const fetchPasses = async () => {
    try {
      const res = await api.get(`/passes/${user._id}`);
      setPasses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, [user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/passes', formData);
      addToast('Visitor pass generated', 'success');
      setShowModal(false);
      setFormData({ visitorName: '', visitorPhone: '', visitDate: '', visitTime: '', purpose: 'friend' });
      fetchPasses();
    } catch (error) {
      addToast(error.response?.data?.message || 'Error generating pass', 'error');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visitor Passes</h1>
          <p className="text-gray-500 mt-1">Generate digital QR passes for your visitors</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <QrCode size={18} /> Generate New Pass
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Loading passes...</div>
        ) : passes.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No active visitor passes. Generate one to invite guests.</p>
          </div>
        ) : (
          passes.map(pass => (
            <div key={pass._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
              {pass.status !== 'active' && (
                <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest rotate-[-15deg]">
                    {pass.status}
                  </span>
                </div>
              )}
              <div className="bg-primary-blue text-white p-4 text-center">
                <h3 className="font-bold text-lg">Visitor Pass</h3>
                <p className="text-blue-200 text-xs mt-1 uppercase tracking-widest">{pass.qrCode}</p>
              </div>
              <div className="p-5 flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-4 inline-block">
                  <QRCodeSVG value={pass.qrCode} size={140} level="H" />
                </div>
                <div className="w-full text-center border-t border-gray-100 pt-3">
                  <h4 className="font-bold text-gray-800 text-lg">{pass.visitorName}</h4>
                  <p className="text-sm text-gray-500 capitalize mb-2">{pass.purpose}</p>
                  <div className="bg-gray-50 rounded-lg p-2 text-sm text-gray-700 flex justify-between">
                    <span>{format(new Date(pass.visitDate), 'dd MMM yyyy')}</span>
                    <span className="font-semibold">{pass.visitTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Visitor Pass</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                  value={formData.visitorName} onChange={e => setFormData({...formData, visitorName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Phone</label>
                <input 
                  type="tel" required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                  value={formData.visitorPhone} onChange={e => setFormData({...formData, visitorPhone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" required min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                    value={formData.visitDate} onChange={e => setFormData({...formData, visitDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input 
                    type="time" required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
                    value={formData.visitTime} onChange={e => setFormData({...formData, visitTime: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none bg-white"
                  value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}
                >
                  <option value="friend">Friend</option>
                  <option value="family">Family</option>
                  <option value="relative">Relative</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-blue text-white font-medium hover:bg-blue-800 rounded-lg transition-colors shadow-sm">Generate Pass</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Passes;
