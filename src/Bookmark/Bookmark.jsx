import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaTimes } from "react-icons/fa";
import { useAuth } from "../ContextAPI/Auth.jsx";
import toast from "react-hot-toast";

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/manga/bookmarks/${userId}`);
        if (!res.ok) throw new Error("Failed to load bookmarks");
        const data = await res.json();
        setBookmarks(data);
      } catch (err) {
        toast.error(err.message || "Error loading bookmarks");
      }
    };

    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  const handleRemove = async (mangaId) => {
    try {
      const res = await fetch(`${apiUrl}/api/manga/${mangaId}/bookmark`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove bookmark");

      setBookmarks(bookmarks.filter((manga) => manga._id !== mangaId));
      toast.success("Bookmark removed");
    } catch (err) {
      toast.error(err.message || "Error removing bookmark");
    }
  };

  const handleRead = (mangaId) => {
    navigate(`/reader/${mangaId}`);
  };

  return (
    <div
      className="min-h-screen text-[#553C1B] p-6 font-montserrat"
      style={{ backgroundColor: "#FFF5E1" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-yellow-600">My Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <p className="text-yellow-700">No bookmarks yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {bookmarks.map((manga) => (
            <div
              key={manga._id}
              className="w-[200px] flex flex-col items-center bg-white rounded-2xl p-2 relative border border-yellow-200"
            >
              {/* Manga Cover */}
              <div className="relative w-full h-[290px] rounded-xl overflow-hidden">
                <img
                  src={
                    manga.coverImage
                      ? `${apiUrl}/uploads/covers/${manga.coverImage}`
                      : "/placeholder-manga.jpg"
                  }
                  alt={manga.title}
                  className="w-full h-full object-cover"
                />

                {/* Read Button */}
                <button
                  onClick={() => handleRead(manga._id)}
                  className="absolute top-2 right-2 bg-yellow-100 p-1.5 rounded-full text-yellow-600 hover:bg-yellow-200 hover:text-yellow-700 transition"
                  title="Read"
                >
                  <FaPlay size={12} />
                </button>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(manga._id)}
                  className="absolute top-2 left-2 bg-red-100 p-1.5 rounded-full text-red-600 hover:bg-red-200 hover:text-red-700 transition"
                  title="Remove"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              {/* Title */}
              <p className="mt-2 text-[#553C1B] text-sm font-medium text-center truncate w-full">
                {manga.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmark;
