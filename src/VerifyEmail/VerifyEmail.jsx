import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    axios
      .get(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.msg);
        setTimeout(() => navigate('/login'), 4000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.msg || 'Verification failed.');
        setTimeout(() => navigate('/login'), 4000);
      });
  }, [navigate, searchParams]);

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: '#FFF5E1' }}
    >
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 max-w-md w-full text-center animate-fade-in">
        <div className="text-5xl mb-4">
          🦉
        </div>
        <h1 className="text-3xl font-extrabold text-orange-600 mb-2">Comic Ninja</h1>
        <h2
          className={`text-lg font-medium mb-3 ${
            status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-700'
          }`}
        >
          {message}
        </h2>
        <p className="text-sm text-gray-600">
          Redirecting to login page in a moment...
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
