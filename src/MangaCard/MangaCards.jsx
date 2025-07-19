import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useManga } from "../ContextAPI/MangaContext";

const MangaCards = ({ mangaList }) => {
  const { mangas, loading, error } = useManga();
  const displayMangas = mangaList || mangas;
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleRead = (mangaId) => {
    navigate(`/manga/${mangaId}/read`);
  };

  const handleInfo = (mangaId) => {
    navigate(`/manga/${mangaId}`);
  };

  const handleImageError = (mangaId) => {
    setImageErrors(prev => ({
      ...prev,
      [mangaId]: true
    }));
  };

  const getImageUrl = (manga) => {
    if (!manga.coverImage) {
      return '/placeholder-manga.jpg';
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const timestamp = new Date().getTime();
    return `${apiUrl}/uploads/covers/${manga.coverImage}?t=${timestamp}`;
  };

  if (loading) {
    return (
      <div className="bg-[#FFF5E1] px-6 py-12 font-[Montserrat]">
        <div className="flex justify-center items-center h-64">
          <div className="text-[#333333] text-lg">Loading comics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFF5E1] px-6 py-12 font-[Montserrat]">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (displayMangas.length === 0) {
    return (
      <div className="bg-[#FFF5E1] px-6 py-12 font-[Montserrat]">
        <div className="flex justify-center items-center h-64">
          <div className="text-[#333333] text-lg">No comics available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF5E1] px-6 py-12 font-[Montserrat] relative">
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#FFDD00] hover:bg-[#FF4C4C] p-2 rounded-full text-[#333333]"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#FFDD00] hover:bg-[#FF4C4C] p-2 rounded-full text-[#333333]"
      >
        <ChevronRight size={24} />
      </button>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-8"
        style={{ scrollBehavior: 'smooth' }}
      >
        {displayMangas.map((manga) => (
          <div
            key={manga._id}
            className="flex-shrink-0 bg-white rounded-xl shadow-md p-3 text-center hover:scale-[1.02] transition w-48 border border-gray-200"
          >
            <div className="relative">
              <img
                src={imageErrors[manga._id] ? '/placeholder-manga.jpg' : getImageUrl(manga)}
                alt={manga.title}
                className="w-44 h-64 object-cover rounded-lg"
                onError={() => handleImageError(manga._id)}
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                <button
                  onClick={() => handleRead(manga._id)}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-[#333333] rounded-full hover:bg-[#FFDD00]"
                  style={{ backgroundColor: '#FFDD00' }}
                >
                  <FaPlay /> Read
                </button>
                <button
                  onClick={() => handleInfo(manga._id)}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-white rounded-full hover:bg-[#FF4C4C]"
                  style={{ backgroundColor: '#333333' }}
                >
                  <FaInfoCircle /> Info
                </button>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[#333333] font-medium">{manga.title}</span>
              {manga.author && (
                <div className="text-gray-600 text-sm mt-1">{manga.author}</div>
              )}
              {manga.isRentable && (
                <div className="text-[#FF4C4C] text-xs mt-1 font-semibold">Rentable</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MangaCards;
