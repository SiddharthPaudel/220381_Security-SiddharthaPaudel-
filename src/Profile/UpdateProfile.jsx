import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../ContextAPI/Auth";
import { useNavigate } from "react-router-dom";

import Avatar1 from "../icons/spiderman.png";
import Avatar2 from "../icons/dead.png";
import Avatar3 from "../icons/mask.png";
import Avatar4 from "../icons/ironman.png";
import Avatar5 from "../icons/antman.png";
import Avatar6 from "../icons/captain.png";

const avatarIcons = [
  { id: 1, icon: <img src={Avatar1} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />, label: "Spiderman" },
  { id: 2, icon: <img src={Avatar2} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />, label: "Deadpool" },
  { id: 3, icon: <img src={Avatar3} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />, label: "Batman" },
  { id: 4, icon: <img src={Avatar4} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />, label: "Ironman" },
  { id: 5, icon: <img src={Avatar5} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />, label: "Antman" },
  { id: 6, icon: <img src={Avatar6} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />, label: "CaptainAmerica" },
];

const UpdateProfile = ({ onClose }) => {
  const { user,  updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [updating, setUpdating] = useState(false);

  const handleClose = () => navigate("/");

  useEffect(() => {
    if (user) {
      setFormData({ username: user.name || "", email: user.email || "" });
      setSelectedAvatar(user.avatar || 1);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarSelect = (id) => {
    setSelectedAvatar(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/auth/update/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          avatar: selectedAvatar,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (updateUserProfile) {
        updateUserProfile({ ...user, name: formData.username, email: formData.email, avatar: selectedAvatar });
      }

      toast.success('Profile updated successfully!', {
        duration: 1000,
        style: { background: '#10B981', color: '#fff' },
      });

      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF5E1] flex items-center justify-center">
        <div className="text-[#553C1B]">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E1] flex items-center justify-center font-[Montserrat] px-2 py-20">
      <div className="relative bg-white text-[#553C1B] rounded-xl shadow-lg w-full max-w-3xl flex overflow-hidden border border-yellow-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-700"
        >
          <FaTimes size={20} />
        </button>

        {/* Left - Avatar Selection */}
        <div className="w-1/3 bg-[#fff3d2] flex flex-col items-center justify-center p-6 border-r border-yellow-200">
          <h3 className="text-xs font-semibold text-yellow-700 mb-4">Choose Avatar</h3>
          <div className="grid grid-cols-2 gap-4">
            {avatarIcons.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarSelect(avatar.id)}
                className={`p-2 rounded-full border-2 transition ${
                  selectedAvatar === avatar.id ? "border-yellow-500" : "border-transparent"
                } hover:border-yellow-400`}
                disabled={updating}
              >
                {avatar.icon}
              </button>
            ))}
          </div>
          <p className="text-xs text-yellow-600 mt-2 text-center">
            {avatarIcons.find(a => a.id === selectedAvatar)?.label}
          </p>
        </div>

        {/* Right - Form */}
        <div className="w-2/3 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-700 text-center">Update Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                disabled={updating}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                disabled={updating}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#553C1B] py-2 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
