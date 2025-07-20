import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import animeImage from '../images/signdead.png';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Strong validation for email & password
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }

    // ✅ Strong password validation: min 8, upper, lower, number, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      toast.error(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account created successfully! Redirecting to login...');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => navigate('/login'), 1000);
      } else {
        toast.error(data.msg || data.error || 'Signup failed');
      }
    } catch (err) {
      toast.error('Network error. Please check if the server is running.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-start pt-16 px-4 font-montserrat" style={{ backgroundColor: "#FFF5E1" }}>
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg max-w-4xl w-full flex max-h-[700px] overflow-y-auto">
        <div className="w-1/2 flex items-center justify-center pr-8 border-r border-gray-300">
          <img src={animeImage} alt="Anime character" className="w-full max-w-sm h-auto object-contain rounded-md" />
        </div>

        <div className="w-1/2 pl-8 flex flex-col justify-center space-y-5 text-gray-900">
          <h2 className="text-3xl font-bold text-yellow-600 text-center mb-6">Sign Up</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" disabled={loading} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" disabled={loading} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-12 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-600 transition" disabled={loading}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-12 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" disabled={loading} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-600 transition" disabled={loading}>
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-2 rounded-md transition ${loading ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold`}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="mt-6 text-center text-gray-700 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
