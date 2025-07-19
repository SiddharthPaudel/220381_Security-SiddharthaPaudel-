import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaBookmark,
  FaCommentDots,
  FaInfoCircle,
  FaExchangeAlt,
  FaExpand,
  FaCompress,
  FaRegBookmark,
  FaBookmark as FaBookmarkFilled,
} from "react-icons/fa";
import { useAuth } from "../ContextAPI/Auth";
import toast from "react-hot-toast";
import Avatar1 from "../icons/a1.png";
import Avatar2 from "../icons/a2.png";
import Avatar3 from "../icons/a3.png";
import Avatar4 from "../icons/a4.png";
import Avatar5 from "../icons/a5.png";
import Avatar6 from "../icons/a6.png";
import { useNavigate } from "react-router-dom";

const avatarIcons = {
  1: (
    <img
      src={Avatar1}
      alt="Avatar 1"
      className="h-9 w-9 rounded-full object-cover"
    />
  ),
  2: (
    <img
      src={Avatar2}
      alt="Avatar 2"
      className="h-9 w-9 rounded-full object-cover"
    />
  ),
  3: (
    <img
      src={Avatar3}
      alt="Avatar 3"
      className="h-9 w-9 rounded-full object-cover"
    />
  ),
  4: (
    <img
      src={Avatar4}
      alt="Avatar 4"
      className="h-9 w-9 rounded-full object-cover"
    />
  ),
  5: (
    <img
      src={Avatar5}
      alt="Avatar 5"
      className="h-9 w-9 rounded-full object-cover"
    />
  ),
  6: (
    <img
      src={Avatar6}
      alt="Avatar 6"
      className="h-9 w-9 rounded-full object-cover"
    />
  ),
};

const MangaReader = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("vertical");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [chapterImages, setChapterImages] = useState([]);
  const [mangaTitle, setMangaTitle] = useState("Loading...");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const toggleScroll = () => {
    setScrollDirection((prev) =>
      prev === "vertical" ? "horizontal" : "vertical"
    );
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/manga/${id}`);
        if (!res.ok) throw new Error("Failed to fetch manga");
        const data = await res.json();

        setMangaTitle(data.title);
        setComments(data.overallComments || []);

        const lastChapter = data.chapters[data.chapters.length - 1];

        if (lastChapter?.imageUrls?.length > 0) {
          const fullUrls = lastChapter.imageUrls.map(
            (imgPath) => `${apiUrl}/uploads/chapters/${imgPath}`
          );
          setChapterImages(fullUrls);
        } else {
          setChapterImages([]);
        }
      } catch (err) {
        console.error("Error fetching manga:", err);
        setMangaTitle("Failed to load");
      }
    };

    fetchManga();
  }, [id]);

  const handleBookmark = async () => {
    if (!user) return toast.error("Please log in to bookmark.");

    try {
      const res = await fetch(`${apiUrl}/api/manga/${id}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Bookmark failed");

      setIsBookmarked(true);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message || "Bookmark failed");
    }
  };

  const handlePostComment = async () => {
    if (!user) return toast.error("Please log in to comment.");

    try {
      const res = await fetch(`${apiUrl}/api/manga/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.name,
          text: newComment,
          avatar: user.avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post comment");

      setComments(data.comments);
      setNewComment("");
      toast.success("Comment posted!");
    } catch (err) {
      toast.error(err.message || "Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return toast.error("Please log in to delete comment.");

    try {
      const res = await fetch(
        `${apiUrl}/api/manga/${id}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const data = await res.json();
      setComments(data.comments); // expects updated comments array here
      if (!res.ok) throw new Error(data.message || "Failed to delete comment");

      setComments(data.comments);
      toast.success("Comment deleted!");
    } catch (err) {
      toast.error(err.message || "Failed to delete comment");
    }
  };

  return (
    <div className="flex bg-[#FFF5E1] min-h-screen text-[#553C1B] relative">
      <aside className="w-64 p-6 bg-[#FFF0D9] hidden md:flex flex-col sticky top-0 h-screen">
        <h2 className="text-xl font-semibold">{mangaTitle}</h2>
        <button
          onClick={toggleScroll}
          className="mt-6 flex items-center gap-2 text-sm bg-[#FFEBCC] hover:bg-[#FFD580] px-3 py-2 rounded"
        >
          <FaExchangeAlt className="text-[#FFC107]" />
          {scrollDirection === "vertical"
            ? "Switch to Horizontal"
            : "Switch to Vertical"}
        </button>
        <button
          onClick={toggleFullScreen}
          className="mt-3 flex items-center gap-2 text-sm bg-[#FFEBCC] hover:bg-[#FFD580] px-3 py-2 rounded"
        >
          {isFullScreen ? (
            <>
              <FaCompress className="text-[#FFC107]" /> Exit Full Screen
            </>
          ) : (
            <>
              <FaExpand className="text-[#FFC107]" /> Full Screen
            </>
          )}
        </button>
        <div className="flex flex-col gap-4 mb-6 mt-auto">
          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-2 hover:text-[#FFC107]"
          >
            <FaCommentDots className="text-[#FFC107]" />
            <span>Comments</span>
          </button>
          <button
            onClick={() => navigate(`/manga/${id}`)} // navigate to Product Details page
            className="flex items-center gap-2 hover:text-[#FFC107]"
          >
            <FaInfoCircle className="text-[grey]" />
            <span>Info</span>
          </button>

          <button
            onClick={handleBookmark}
            className="flex items-center gap-2 text-[#553C1B] hover:text-[#FFC107]"
          >
            {isBookmarked ? <FaBookmarkFilled /> : <FaRegBookmark />}
            <span>Bookmark</span>
          </button>
        </div>
      </aside>

      <main
        className={`flex-1 p-4 ${
          scrollDirection === "horizontal"
            ? "flex gap-4 overflow-x-auto"
            : "space-y-4 overflow-y-auto"
        }`}
      >
        {chapterImages.length === 0 ? (
          <p className="text-gray-600 text-center w-full mt-10">
            No chapter pages available.
          </p>
        ) : (
          chapterImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Page ${idx + 1}`}
              className={`rounded shadow-md object-contain ${
                scrollDirection === "horizontal"
                  ? "w-[75%] min-w-[450px] max-w-[700px]"
                  : "w-full max-w-4xl mx-auto"
              }`}
            />
          ))
        )}
      </main>

      {showComments && (
        <div className="fixed top-0 right-0 w-80 h-full bg-[#FFF0D9] p-4 z-50 shadow-lg border-l border-yellow-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-gray-400 hover:text-[#553C1B] text-xl font-bold"
              aria-label="Close comments"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-600">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start gap-3 bg-[#FFEBCC] p-3 rounded shadow"
                >
                  {/* User Avatar */}
                  {avatarIcons[comment.avatar] || (
                    <div className="w-10 h-10 rounded-full bg-[#D6B954] flex items-center justify-center text-[#553C1B] font-semibold uppercase">
                      {comment.username ? comment.username.charAt(0) : "U"}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#553C1B]">
                        {comment.username || "Unknown User"}
                      </span>
                      {comment.userId === user?.id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-xs text-red-500 hover:underline"
                          aria-label="Delete comment"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-[#553C1B] text-sm mt-1 whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New Comment Box */}
          <div className="mt-4 pt-4 border-t border-yellow-300">
            <textarea
              className="w-full bg-[#FFEBCC] p-3 text-sm text-[#553C1B] rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
              placeholder="Write a comment..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              onClick={handlePostComment}
              disabled={newComment.trim() === ""}
              className={`mt-2 w-full py-2 rounded text-[#553C1B] font-semibold transition ${
                newComment.trim() === ""
                  ? "bg-yellow-300 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-300"
              }`}
            >
              Post Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangaReader;
