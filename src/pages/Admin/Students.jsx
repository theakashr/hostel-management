import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <div>Loading students...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students Directory</h1>
        <p className="text-gray-500 mt-1">Manage all registered students</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Student ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fee Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map(s => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{s.studentId}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">{s.userId?.fullName}</div>
                    <div className="text-xs text-gray-500">{s.userId?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.roomId?.roomNumber || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.year}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                      s.feeStatus === 'paid' ? 'bg-green-100 text-accent-green' : 'bg-yellow-100 text-warning-yellow'
                    }`}>
                      {s.feeStatus}
                    </span>
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

export default Students;
