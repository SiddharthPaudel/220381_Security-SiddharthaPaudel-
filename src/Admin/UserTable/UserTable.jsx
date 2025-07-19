import React, { useEffect, useState } from "react";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/auth`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#121212] font-[Montserrat]">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-[#121212] font-[Montserrat]">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 font-[Montserrat]">
      <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6">Registered Users</h2>

        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="bg-[#2c2c2c] text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-gray-700">#</th>
                <th className="px-6 py-4 border-b border-gray-700">Username</th>
                <th className="px-6 py-4 border-b border-gray-700">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-[#292929] transition duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-200">{index + 1}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
