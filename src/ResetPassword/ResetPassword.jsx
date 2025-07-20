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
      toast.error("Passwords do not match", {
        style: {
          borderRadius: "12px",
          background: "#FFF5E1",
          color: "#553C1B",
          border: "1px solid #ef4444",
        },
      });
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
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5E1] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFEBCC] text-[#553C1B] rounded-xl shadow-lg p-8 max-w-md w-full border border-yellow-300"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-[#D97706]">
          Reset Password
        </h2>

        <label htmlFor="newPassword" className="block mb-2 font-medium text-[#553C1B]">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-[#FFF0D9] border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6 transition text-[#553C1B] placeholder-[#a06e2b]"
        />

        <label htmlFor="confirmPassword" className="block mb-2 font-medium text-[#553C1B]">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-[#FFF0D9] border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6 transition text-[#553C1B] placeholder-[#a06e2b]"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#553C1B] py-3 rounded-md font-semibold transition"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
