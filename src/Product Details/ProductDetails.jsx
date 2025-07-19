import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark, FaStar, FaRegStar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../ContextAPI/Auth";
import toast from "react-hot-toast";

import Avatar1 from "../icons/spiderman.png";
import Avatar2 from "../icons/dead.png";
import Avatar3 from "../icons/mask.png";
import Avatar4 from "../icons/ironman.png";
import Avatar5 from "../icons/antman.png";
import Avatar6 from "../icons/captain.png";

const avatarIcons = {
  1: <img src={Avatar1} alt="Avatar 1" className="h-9 w-9 rounded-full object-cover" />,
  2: <img src={Avatar2} alt="Avatar 2" className="h-9 w-9 rounded-full object-cover" />,
  3: <img src={Avatar3} alt="Avatar 3" className="h-9 w-9 rounded-full object-cover" />,
  4: <img src={Avatar4} alt="Avatar 4" className="h-9 w-9 rounded-full object-cover" />,
  5: <img src={Avatar5} alt="Avatar 5" className="h-9 w-9 rounded-full object-cover" />,
  6: <img src={Avatar6} alt="Avatar 6" className="h-9 w-9 rounded-full object-cover" />,
};

// ... (your imports remain same)

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const [manga, setManga] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/manga/${id}`);
        if (!res.ok) throw new Error("Failed to fetch manga");
        const data = await res.json();
        setManga(data);
        setIsBookmarked(data.bookmarks?.includes(userId));

        const userRatingData = data.ratings?.find((r) => r.userId._id === userId);
        if (userRatingData) {
          setUserRating(userRatingData.rating);
          setReviewText(userRatingData.review || "");
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchManga();
    }
  }, [id, userId]);

  const handleBookmark = async () => {
    if (!user) return toast.error("Please log in to bookmark");

    try {
      const res = await fetch(`${apiUrl}/api/manga/${manga._id}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to bookmark");

      setIsBookmarked(true);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message || "Bookmark failed");
    }
  };

  const handleSubmitReview = async () => {
    const avatar = user.avatar || null;
    try {
      const res = await fetch(`${apiUrl}/api/manga/rate/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, rating: userRating, review: reviewText, avatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      toast.success("Review submitted successfully!");
      setManga((prev) => ({
        ...prev,
        ratings: [
          ...prev.ratings.filter((r) => r.userId._id !== userId),
          {
            _id: Date.now(),
            userId: { _id: userId, name: user.name },
            rating: userRating,
            review: reviewText,
            avatar: user.avatar,
          },
        ],
      }));
      setReviewText("");
    } catch (err) {
      toast.error(err.message || "Review submission failed");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!userId) return toast.error("User not logged in");

    try {
      const res = await fetch(`${apiUrl}/api/manga/review/${id}/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast.success("Review deleted successfully");
      setManga((prev) => ({
        ...prev,
        ratings: prev.ratings.filter((r) => r._id !== reviewId),
      }));
      setUserRating(0);
      setReviewText("");
    } catch (error) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF5E1] text-[#553C1B] font-montserrat">Loading manga details...</div>;
  }

  if (!manga) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF5E1] text-[#553C1B] font-montserrat">Manga not found.</div>;
  }

  return (
    <div className="bg-[#FFF5E1] text-[#553C1B] min-h-screen px-6 py-10 font-montserrat">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        <img src={`${apiUrl}/uploads/covers/${manga.coverImage}`} alt={manga.title} className="w-[220px] h-[330px] rounded-lg shadow-lg object-cover" />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold">{manga.title}</h1>
            <p className="text-gray-500 italic mt-1">{manga.jpTitle}</p>

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => navigate(`/manga/${manga._id}/read`)}
                className="text-[#553C1B] px-4 py-2 rounded-md hover:bg-yellow-200"
                style={{ backgroundColor: "#FFC107" }}
              >
                Read Now
              </button>

              <button
                onClick={() =>
                  navigate("/rent", {
                    state: {
                      mangaId: manga._id,
                      title: manga.title,
                      coverImage: manga.coverImage,
                      pricePerDay: manga.rentalDetails?.price,
                      durationUnit: manga.rentalDetails?.duration?.unit || "days",
                    },
                  })
                }
                className="text-[#553C1B] px-6 py-2 rounded-md text-sm font-medium hover:bg-yellow-200 transition"
                style={{ backgroundColor: "#FFC107" }}
              >
                💸 Rent Rs {manga.rentalDetails?.price ?? "N/A"}/{manga.rentalDetails?.duration?.unit ?? "day"}
              </button>

              <button onClick={handleBookmark} className="p-2 bg-[#fff1c9] rounded-md text-[#553C1B] hover:text-yellow-700">
                {isBookmarked ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {manga.genre?.map((tag) => (
                <span key={tag} className="bg-[#ffeec4] text-sm px-3 py-1 rounded-full text-[#553C1B] border border-yellow-300">{tag}</span>
              ))}
            </div>

            <p className="mt-5 text-sm text-[#553C1B] leading-relaxed">{manga.description}</p>
          </div>
        </div>

        <div className="w-full md:w-72 bg-[#fff3d2] p-6 rounded-lg shadow-md border border-yellow-200">
          <ul className="text-sm text-[#553C1B] space-y-3">
            <li><strong>Type:</strong> {manga.type || "Manga"}</li>
            <li><strong>Author:</strong> {manga.author || "Unknown"}</li>
          </ul>

          <div className="mt-6">
            <div className="flex items-center text-[#FFC107] text-xl font-bold mb-1">
              <FaStar className="mr-1" />
              {userRating > 0 ? userRating.toFixed(1) : (manga.rating ?? "4.5")}
              <span className="text-sm text-[#553C1B] ml-2">Rate us 😉</span>
            </div>

            <p className="text-sm text-[#553C1B]">Give me your Rating?</p>
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setUserRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none">
                  {star <= (hoverRating || userRating) ? <FaStar className="text-[#FFC107]" size={24} /> : <FaRegStar className="text-[#FFC107]" size={24} />}
                </button>
              ))}
            </div>

            <textarea
              className="w-full mt-4 p-3 rounded-lg text-sm text-[#553C1B] focus:outline-none resize-none border border-yellow-300 bg-white"
              rows={4}
              placeholder="Write your detailed review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <button
              onClick={handleSubmitReview}
              className="mt-3 bg-[#FFC107] text-[#553C1B] px-4 py-2 rounded-md w-full hover:bg-yellow-300 transition font-semibold"
            >
              Submit Review
            </button>

            <div className="mt-8">
              <h2 className="text-lg font-bold text-[#553C1B] mb-4 border-b border-yellow-300 pb-2">User Reviews</h2>
              {manga.ratings?.length === 0 ? (
                <p className="text-[#553C1B]">No reviews yet.</p>
              ) : (
                <div className="space-y-6 max-h-72 overflow-y-auto pr-2">
                  {manga.ratings.map((review, index) => (
                    <div key={index} className="bg-[#fff8e3] p-4 rounded-xl shadow-md border border-yellow-300 hover:border-[#FFC107] transition duration-200 flex gap-4">
                      <div className="flex-shrink-0">
                        {avatarIcons[review.avatar] || (
                          <div className="w-10 h-10 rounded-full bg-[#553C1B] flex items-center justify-center text-white font-semibold uppercase">
                            {review.userId?.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-1 text-[#FFC107] mb-1">
                          {[1, 2, 3, 4, 5].map((i) =>
                            i <= review.rating ? (
                              <FaStar key={i} size={16} />
                            ) : (
                              <FaRegStar key={i} size={16} />
                            )
                          )}
                          <span className="ml-2 text-sm text-[#553C1B]">{review.rating.toFixed(1)}</span>
                        </div>

                        <div className="bg-white border-l-4 border-yellow-300 p-3 mt-2 rounded-md text-[#553C1B] text-sm italic">
                          “{review.review}”
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-[#553C1B]">— {review.userId?.name || "Unknown User"}</p>
                          {review.userId?._id === userId && (
                            <button onClick={() => handleDeleteReview(review._id)} className="text-red-500 text-xs hover:underline">
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;



