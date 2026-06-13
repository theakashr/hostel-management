import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import api from '../../utils/api';
import { Users, Wifi, Wind, Info, MapPin } from 'lucide-react';

const Room = () => {
  const { user } = useStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/students/${user._id}/room`);
        setData(res.data);
      } catch (error) {
        console.error('Error fetching room', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [user._id]);

  if (loading) return <div>Loading room details...</div>;

  if (!data || !data.room) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-lg mx-auto mt-10">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Room Assigned</h2>
        <p className="text-gray-500">You haven't been assigned a room yet. Please contact the warden or admin for allocation.</p>
      </div>
    );
  }

  const { room, roommates } = data;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Room Details</h1>
          <p className="text-gray-500 mt-1">Information about your current accommodation</p>
        </div>
        <div className="bg-primary-blue text-white px-4 py-2 rounded-lg font-bold shadow-sm">
          {room.roomNumber}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg"><MapPin className="text-primary-blue" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Location</p>
            <p className="font-semibold text-gray-800">{room.blockName}, {room.floor}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-lg"><Users className="text-accent-green" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Capacity</p>
            <p className="font-semibold text-gray-800">{room.occupants.length} / {room.capacity} Occupants</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-50 p-3 rounded-lg"><DollarSign className="text-purple-600" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Monthly Rent</p>
            <p className="font-semibold text-gray-800">₹{room.monthlyRent}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Facilities</h3>
          <div className="flex flex-wrap gap-3">
            {room.facilities.map((fac, idx) => (
              <span key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 text-sm font-medium text-gray-700">
                {fac.toLowerCase().includes('ac') ? <Wind size={16} className="text-blue-500"/> : <Wifi size={16} className="text-blue-500"/>}
                {fac}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Roommates</h3>
          {roommates.length === 0 ? (
            <p className="text-gray-500 text-sm">You currently have no roommates.</p>
          ) : (
            <ul className="space-y-4">
              {roommates.map((rm) => (
                <li key={rm._id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold">
                    {rm.userId.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{rm.userId.fullName}</p>
                    <p className="text-xs text-gray-500">{rm.userId.phone || rm.userId.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
