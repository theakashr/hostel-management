import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import useStore from '../../store/useStore';

const RoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        setRooms(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Room Allocation</h1>
        <p className="text-gray-500 mt-1">Manage hostel rooms and assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-4 border-gray-100">
              <h3 className="text-xl font-bold text-primary-blue">{room.roomNumber}</h3>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {room.blockName}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Occupancy</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${room.occupants.length >= room.capacity ? 'bg-alert-red' : 'bg-accent-green'}`} 
                  style={{ width: `${(room.occupants.length / room.capacity) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1 text-gray-600">{room.occupants.length} / {room.capacity} filled</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Occupants (IDs)</p>
              {room.occupants.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Empty room</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {room.occupants.map((occ, idx) => (
                    <span key={idx} className="bg-blue-50 text-primary-blue border border-blue-100 px-2 py-1 rounded text-xs font-medium">
                      {occ}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAllocation;
