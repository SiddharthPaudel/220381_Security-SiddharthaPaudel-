import React, { useEffect, useState } from 'react';
import { useAuth } from '../ContextAPI/Auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RentDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchRentals = async () => {
      if (!user) return;

      try {
        const res = await fetch(`${apiUrl}/api/manga/user/${user.id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch rentals');
        setRentals(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [user]);

  useEffect(() => {
    if (rentals.length > 0) {
      const expired = rentals.find(r => new Date(r.expiresAt) < new Date());
      if (expired) {
        toast.error(`⚠️ Your rental for ${expired.mangaId?.title || "a manga"} has expired.`);
      }
    }
  }, [rentals]);

  return (
    <div className="min-h-screen bg-[#FFF5E1] text-[#553C1B] p-6 font-[Montserrat]">
      <h1 className="text-3xl font-bold mb-6 text-[#553C1B]">📚 My Rental History</h1>

      {loading ? (
        <p className="text-[#888]">Loading...</p>
      ) : rentals.length === 0 ? (
        <p className="text-gray-500">You haven't rented any manga yet.</p>
      ) : (
        <div className="space-y-6">
          {rentals.map((rent) => {
            const total = rent.price;
            const title = rent.mangaId?.title || 'Unknown';
            const image = `${apiUrl}/uploads/covers/${rent.mangaId?.coverImage || ''}`;
            const now = new Date();
            const rentedAt = new Date(rent.rentedAt);
            const expiresAt = new Date(rent.expiresAt);
            const isExpired = expiresAt < now;
            const days = Math.ceil((expiresAt - rentedAt) / (1000 * 60 * 60 * 24));

            const remainingMs = expiresAt - now;
            const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
            const remainingHours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            const status = isExpired ? 'Returned' : 'Active';

            return (
              <div
                key={rent._id}
                className="bg-[#fff3d2] border border-yellow-300 rounded-2xl shadow-md p-5 flex flex-col md:flex-row gap-4 transition-all hover:scale-[1.01]"
              >
                <img
                  src={image}
                  alt={title}
                  className="rounded-xl w-48 h-64 object-cover border border-yellow-200"
                />

                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="text-2xl font-bold text-[#553C1B] mb-2">{title}</h2>
                    <p className="text-sm text-gray-600">Days: <span className="text-[#553C1B]">{days}</span></p>
                    <p className="text-sm text-gray-600">Payment: <span className="text-[#FFC107]">{rent.paymentMethod}</span></p>
                    <p className="text-sm text-gray-600">Per Day: Rs {Math.round(rent.price / days)}</p>
                    <p className="text-sm text-gray-600 mt-1">Total: <span className="font-bold text-[#553C1B]">Rs {total}</span></p>
                    <p className="text-sm text-gray-600">Rented At: {rentedAt.toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Expires At: {expiresAt.toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'Returned' ? 'bg-red-300 text-[#553C1B]' : 'bg-green-300 text-[#553C1B]'}`}>
                      {status}
                    </span>
                    <button
                      className="text-sm text-[#FFC107] underline hover:text-yellow-500"
                      onClick={() => toast("Invoice feature coming soon...")}
                    >
                      View Invoice
                    </button>
                  </div>

                  {isExpired ? (
                    <p className="mt-3 text-sm text-red-500 italic">
                      ⚠️ Your rental for <span className="font-semibold">{title}</span> has expired.
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-green-600 italic">
                      ⏳ {remainingDays} day(s) and {remainingHours} hour(s) remaining.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RentDetails;
