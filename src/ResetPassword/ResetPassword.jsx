import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        newPassword,
      });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e1e1e] text-white rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-purple-500">
          Reset Password
        </h2>

        <label htmlFor="newPassword" className="block mb-2 font-medium text-gray-300">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-[#222222] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6 transition"
        />

        <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-300">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-[#222222] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6 transition"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-md font-semibold transition"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
