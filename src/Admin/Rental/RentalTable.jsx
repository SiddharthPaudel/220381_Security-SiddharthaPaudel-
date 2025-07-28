import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast'; // Only import toast, not Toaster

const RentalTable = () => {
  const [rentals, setRentals] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/manga/rentals`);
        const data = await res.json();
        setRentals(data);
      } catch (err) {
        toast.error('Failed to fetch rentals');
      }
    };

    fetchRentals();
  }, []);

  const handleDelete = (rentalId) => {
    toast(
      (t) => (
        <div className="min-w-[250px]">
          <p className="mb-2">Are you sure you want to delete this rental?</p>
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 text-white"
              onClick={() => {
                toast.dismiss(t.id);
                deleteRental(rentalId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };
const token = localStorage.getItem('token');
  const deleteRental = async (rentalId) => {
    const toastId = toast.loading('Deleting rental...');

    try {
      const res = await fetch(`${apiUrl}/api/manga/rental/${rentalId}`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${token}`, // 🔐 Include token for auth check
  },
})
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Delete failed');

      setRentals((prev) => prev.filter((r) => r._id !== rentalId));
      toast.success('Rental deleted successfully', { id: toastId });
    } catch (err) {
      toast.error('Failed to delete rental: ' + err.message, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 font-[Montserrat]">
      <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Comic Rentals</h2>

        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="bg-[#2c2c2c] text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b border-gray-700">User Name</th>
                <th className="px-4 py-3 border-b border-gray-700">Manga Title</th>
                <th className="px-4 py-3 border-b border-gray-700">Rented At</th>
                <th className="px-4 py-3 border-b border-gray-700">Expires At</th>
                <th className="px-4 py-3 border-b border-gray-700">Phone</th>
                <th className="px-4 py-3 border-b border-gray-700">Location</th>
                <th className="px-4 py-3 border-b border-gray-700">Payment</th>
                <th className="px-4 py-3 border-b border-gray-700">Price (Rs)</th>
                <th className="px-4 py-3 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {rentals.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-6 text-center text-gray-500">
                    No rental records found.
                  </td>
                </tr>
              ) : (
                rentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-[#292929] transition">
                    <td className="px-4 py-3 text-gray-200">{rental.userId?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">{rental.mangaId?.title || 'Unknown'}</td>
                    <td className="px-4 py-3">{new Date(rental.rentedAt).toLocaleString()}</td>
                    <td className="px-4 py-3">{new Date(rental.expiresAt).toLocaleString()}</td>
                    <td className="px-4 py-3">{rental.phoneNumber}</td>
                    <td className="px-4 py-3">{rental.location ? rental.location.split('?data=')[0] : ''}</td>
                    <td className="px-4 py-3">{rental.paymentMethod}</td>
                    <td className="px-4 py-3 font-semibold text-yellow-400">Rs {rental.price}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(rental._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
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

export default RentalTable;
