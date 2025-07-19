import React, { createContext, useContext, useState, useEffect } from 'react';

const MangaContext = createContext();

export const useManga = () => {
  const context = useContext(MangaContext);
  if (!context) {
    throw new Error('useManga must be used within a MangaProvider');
  }
  return context;
};

export const MangaProvider = ({ children }) => {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMangas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fix the API URL construction
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = `${apiUrl}/api/manga`;
      
      console.log('Fetching from URL:', url); // Debug log
      
      const response = await fetch(url);
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned ${contentType}, expected JSON`);
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        // Your API returns an array directly, so handle that first
        if (Array.isArray(data)) {
          setMangas(data);
        } else if (data.mangas && Array.isArray(data.mangas)) {
          setMangas(data.mangas);
        } else if (data.data && Array.isArray(data.data)) {
          setMangas(data.data);
        } else {
          console.warn('Unexpected data structure:', data);
          setMangas([]);
        }
      } else {
        // Handle HTTP errors
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        setError(`HTTP ${response.status}: Failed to fetch manga data`);
      }
    } catch (err) {
      console.error('Error fetching mangas:', err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addManga = (newManga) => {
    // Add new manga optimistically
    setMangas(prev => [...prev, newManga]);
  };

  const refreshMangas = () => {
    fetchMangas(); // Re-fetch latest data from server
  };

  useEffect(() => {
    fetchMangas();
  }, []);

  const value = {
    mangas,
    loading,
    error,
    addManga,
    refreshMangas,
    fetchMangas
  };

  return (
    <MangaContext.Provider value={value}>
      {children}
    </MangaContext.Provider>
  );
};