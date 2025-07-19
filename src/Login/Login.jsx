import React, { useState } from "react";
import animeImage from "../images/loginpool.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../ContextAPI/Auth";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const loadingToast = toast.loading(
      <span className="flex items-center gap-2">
        <svg
          className="animate-spin h-4 w-4 text-yellow-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Entering the manga verse...
      </span>,
      {
        duration: Infinity,
        style: {
          borderRadius: "12px",
          background: "#FFF5E1",
          color: "#553C1B",
          border: "1px solid #FBBF24",
        },
      }
    );

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      login(res.data.token, res.data.user);

      toast.success(
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-yellow-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Welcome back, manga reader! 📚✨
        </span>,
        {
          id: loadingToast,
          duration: 1200,
          style: {
            borderRadius: "12px",
            background: "#FFF5E1",
            color: "#553C1B",
            border: "1px solid #D97706",
          },
          icon: null,
        }
      );

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.msg || "Login failed. Please try again.";
      setError(errorMessage);

      toast.error(`Authentication failed! ${errorMessage} 💥`, {
        id: loadingToast,
        duration: 5000,
        style: {
          borderRadius: "12px",
          background: "#FFF5E1",
          color: "#7F1D1D",
          border: "1px solid #B91C1C",
        },
        iconTheme: {
          primary: "#B91C1C",
          secondary: "#FFF5E1",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen justify-center items-center px-4 font-montserrat"
      style={{ backgroundColor: "#FFF5E1" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-8 shadow-lg max-w-4xl w-full flex text-[#553C1B] h-[520px]"
      >
        {/* Left side: Image */}
        <div className="w-1/2 flex items-center justify-center pr-0 border-r border-yellow-300">
          <img
            src={animeImage}
            alt="Anime character"
            className="w-full max-w-sm h-auto object-contain rounded-md"
          />
        </div>

        {/* Right side: Login Fields */}
        <div className="w-1/2 pl-8 flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold text-yellow-600 text-center mb-4">
            Login
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-yellow-50 text-[#553C1B]"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-md border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-yellow-50 text-[#553C1B]"
              required
              disabled={isLoading}
            />
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-yellow-600 hover:underline transition"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Entering...
              </>
            ) : (
              "Login"
            )}
          </button>

          <p className="mt-6 text-center text-yellow-700 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
