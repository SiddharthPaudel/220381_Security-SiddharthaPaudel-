import React, { useState, useRef } from "react";
import animeImage from "../images/loginpool.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../ContextAPI/Auth";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6Le-K4krAAAAAJt8lB_XC29owPpNrFK2TWdi5mSl"; // Replace with your actual site key

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Store recaptcha token
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const onCaptchaChange = (token) => {
  console.log("Captcha token:", token);  // <-- Add this line
  setCaptchaToken(token);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // If not in OTP step, check captcha first
    if (!isOtpStep && !captchaToken) {
      toast.error("Please complete the CAPTCHA to proceed.");
      return;
    }

    setIsLoading(true);

    const loadingToast = toast.loading(
      <span className="flex items-center gap-2">
        <svg className="animate-spin h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Entering the comic verse...
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
      // Send captchaToken only on first step
      const payload = isOtpStep
        ? { ...formData, otp }
        : { ...formData, captchaToken };

      const res = await axios.post("http://localhost:5000/api/auth/login", payload);

      if (res.data.requireOtp) {
        toast.success("OTP sent to your email 📧", {
          id: loadingToast,
          duration: 1000,
        });
        setIsOtpStep(true);
        setIsLoading(false);
        // Reset captcha token for next login attempt if needed
        setCaptchaToken(null);
        if (recaptchaRef.current) recaptchaRef.current.reset();
        return;
      }

      login(res.data.token, res.data.user);

      toast.success(
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
      const errorMessage = err.response?.data?.msg || "Login failed. Please try again.";
      setError(errorMessage);

      toast.error(`Authentication failed! ${errorMessage} 💥`, {
        id: loadingToast,
        duration: 1000,
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

      // Reset captcha on error to force user to solve it again
      setCaptchaToken(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center px-4 font-montserrat" style={{ backgroundColor: "#FFF5E1" }}>
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg max-w-4xl w-full flex text-[#553C1B] h-[580px]">
        {/* Left side: Image */}
        <div className="w-1/2 flex items-center justify-center pr-0 border-r border-yellow-300">
          <img src={animeImage} alt="Anime character" className="w-full max-w-sm h-auto object-contain rounded-md" />
        </div>

        {/* Right side: Login Fields */}
        <div className="w-1/2 pl-8 flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold text-yellow-600 text-center mb-4">Login</h2>

          {!isOtpStep && (
            <>
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
                  <Link to="/forgot-password" className="text-sm text-yellow-600 hover:underline transition">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* RECAPTCHA */}
              <div className="mt-4">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={onCaptchaChange}
                  ref={recaptchaRef}
                  theme="light"
                />
              </div>
            </>
          )}

          {isOtpStep && (
            <div>
              <label className="block text-sm font-medium mb-1">OTP Code</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your 6-digit OTP"
                className="w-full px-4 py-2 rounded-md border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-yellow-50 text-[#553C1B]"
                required
                disabled={isLoading}
              />
            </div>
          )}

          {error && <div className="text-sm text-red-600 text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isOtpStep ? "Verifying OTP..." : "Entering..."}
              </>
            ) : isOtpStep ? "Verify OTP" : "Login"}
          </button>

          {!isOtpStep && (
            <p className="mt-6 text-center text-yellow-700 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-yellow-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
