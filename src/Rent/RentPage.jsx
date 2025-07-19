import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../ContextAPI/Auth';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import esewa from '../images/esewa.png';

const RentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [days, setDays] = useState(3);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [loading, setLoading] = useState(false);

  const total = days * state.pricePerDay;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleRent = async () => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    if (!phoneNumber.match(/^\d{10}$/)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    if (!locationInput.trim()) {
      toast.error("Please enter your location.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/manga/${state.mangaId}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          durationValue: days,
          durationUnit: state.durationUnit || "days",
          paymentMethod,
          phoneNumber,
          location: locationInput.trim()
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rent");

      if (data.esewa) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.action;

        Object.entries(data.values).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      toast.success("Manga rented successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => navigate(-1);

  return (
    <div className="min-h-screen bg-[#FFF5E1] text-[#553C1B] font-[Montserrat] flex justify-center items-start pt-20 px-4">
      <div className="relative bg-[#fff3d2] max-w-5xl w-full rounded-3xl shadow-2xl p-8 flex flex-col lg:flex-row gap-8 border border-yellow-300">
        <button className="absolute top-4 right-4 text-[#553C1B] hover:text-red-500 text-lg" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="flex-shrink-0 flex justify-center">
          <img
            src={`${apiUrl}/uploads/covers/${state.coverImage}`}
            alt={state.title}
            className="w-52 h-80 rounded-2xl object-cover shadow-lg border border-yellow-200"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{state.title}</h2>
              <div className="text-lg text-[#FFC107] font-semibold">
                Total: <span className="text-[#553C1B]">Rs {total}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Price/Day: Rs {state.pricePerDay}
            </p>

            <div>
              <label className="text-sm mb-1 block">Duration:</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-transparent border border-yellow-300 rounded-full px-4 py-2 w-24 text-sm focus:ring-2 focus:ring-[#FFC107] focus:outline-none"
                />
                <span className="text-sm text-gray-500">{state.durationUnit}</span>
              </div>
            </div>

            <div>
              <label className="text-sm mb-1 block">Phone Number:</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit phone number"
                className="w-full bg-transparent border border-yellow-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#FFC107] focus:outline-none text-[#553C1B] placeholder-gray-500"
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Location:</label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter your location"
                className="w-full bg-transparent border border-yellow-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#FFC107] focus:outline-none text-[#553C1B] placeholder-gray-500"
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Payment Via</label>
              <div className="flex gap-3 flex-wrap">
                {['Esewa'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-4 py-2 text-sm rounded-full border transition flex items-center gap-2 ${
                      paymentMethod === method
                        ? 'bg-[#FFC107] text-[#553C1B] border-yellow-300'
                        : 'bg-transparent border-yellow-300 text-gray-600 hover:bg-yellow-100'
                    }`}
                  >
                    <img src={esewa} alt="eSewa" className="w-5 h-5" />
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              disabled={loading}
              onClick={handleRent}
              className={`bg-[#FFC107] hover:bg-yellow-300 text-[#553C1B] font-semibold py-3 px-6 rounded-full transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Renting..." : "Rent Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentPage;
