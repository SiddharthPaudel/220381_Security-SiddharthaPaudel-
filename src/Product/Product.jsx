import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import MangaCards from "../MangaCard/MangaCards";
import toast from "react-hot-toast";

const Product = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [topRated, setTopRated] = useState([]);
  const [allMangas, setAllMangas] = useState([]);

  const genres = ["All Genres", "Fantasy", "Adventure", "Sci-Fi"];
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch top-rated manga
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/manga/top-rated`);
        if (!res.ok) throw new Error("Failed to fetch top-rated manga");
        const data = await res.json();
        setTopRated(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchTopRated();
  }, []);

  // Fetch all mangas for search & filter
  useEffect(() => {
    const fetchAllMangas = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/manga`);
        if (!res.ok) throw new Error("Failed to fetch all mangas");
        const data = await res.json();
        setAllMangas(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchAllMangas();
  }, []);

  // Filter logic
  const filteredManga = allMangas.filter((manga) => {
    const titleMatch = manga.title.toLowerCase().includes(searchTerm.toLowerCase());
    const genreMatch = selectedGenre ? manga.genre.includes(selectedGenre) : true;
    return titleMatch && genreMatch;
  });

  return (
    <div className="min-h-screen bg-[#FFF5E1] text-gray-900 font-montserrat">
      {/* Header */}
      <div className="px-6 pt-8">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8 relative">
            <div className="flex items-center bg-white rounded-full px-4 py-3 gap-3 relative shadow-md">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-500 transition-colors"
              >
                FILTER
              </button>
              <input
                type="text"
                placeholder="Search comic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 text-sm focus:outline-none placeholder-gray-500"
              />
              <button className="p-2 hover:bg-yellow-200 rounded-full transition-colors">
                <FaSearch className="text-yellow-700 text-sm" />
              </button>

              {/* Filter Dropdown */}
              {showFilter && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-yellow-300 rounded-lg shadow-lg w-48 z-20">
                  {genres.map((genre) => (
                    <div
                      key={genre}
                      onClick={() => {
                        setSelectedGenre(genre === "All Genres" ? "" : genre);
                        setShowFilter(false);
                      }}
                      className={`px-4 py-3 text-sm cursor-pointer border-b last:border-b-0 ${
                        selectedGenre === (genre === "All Genres" ? "" : genre)
                          ? "bg-yellow-100 text-yellow-700"
                          : "text-gray-700 hover:bg-yellow-50"
                      }`}
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filtered MangaCards */}
      <MangaCards mangaList={filteredManga} />

      {/* Content */}
      <div className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Latest Updates & Most Viewed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest Updates */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold">Latest Updates</h2>
                <div className="flex gap-2">
                  <button className="bg-yellow-400 text-yellow-900 px-4 py-1 text-sm rounded font-semibold">
                    Chapter
                  </button>
                  <button className="text-gray-600 px-4 py-1 text-sm hover:text-yellow-700 rounded transition">
                    Volume
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topRated.slice(0, 4).map((manga, index) => (
                  <div
                    key={manga._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg flex gap-5 p-5"
                  >
                    <img
                      src={`${apiUrl}/uploads/covers/${manga.coverImage}`}
                      alt={manga.title}
                      className="w-28 h-40 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-900 text-lg font-semibold mb-2">{manga.title}</h3>
                      <p className="text-sm text-gray-700 mb-3">{manga.genre?.slice(0, 3).join(", ")}</p>
                      <div className="space-y-2 text-yellow-700 font-semibold">
                        {[0, 1, 2].map((offset) => (
                          <div key={offset} className="flex items-center gap-2 text-sm">
                            <span>📖 Chap {47 - index - offset} [EN]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Viewed */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Top Rated</h2>
              </div>

              <div className="space-y-5">
                {topRated.slice(0, 5).map((manga, index) => (
                  <div
                    key={manga._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md flex items-center p-4 gap-4"
                  >
                    <div className="text-yellow-700 text-2xl font-bold w-10">0{index + 1}</div>
                    <img
                      src={`${apiUrl}/uploads/covers/${manga.coverImage}`}
                      alt={manga.title}
                      className="w-20 h-28 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-900 text-base font-semibold mb-1">{manga.title}</h3>
                      <p className="text-sm text-gray-700 mb-2">{manga.genre?.[0]}</p>
                      <div className="flex gap-3 text-sm text-yellow-700 font-semibold">
                        <span>📖 Chap {150 - index * 30}</span>
                        <span>📚 Vol {index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
