import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
const AddChapter = () => {
  const [mangas, setMangas] = useState([]);
  const [selectedManga, setSelectedManga] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [zipFile, setZipFile] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/manga`);
        if (!res.ok) throw new Error("Failed to fetch mangas");
        const data = await res.json();
        setMangas(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load mangas");
      }
    };

    fetchMangas();
  }, [apiUrl]);

  const handleFileChange = (e) => {
    setZipFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedManga) {
      alert("Please select a manga");
      return;
    }
    if (!chapterTitle.trim()) {
      alert("Please enter chapter title");
      return;
    }
    if (!zipFile) {
      alert("Please upload a zip file");
      return;
    }

    const formData = new FormData();
    formData.append("title", chapterTitle);
    formData.append("zipFile", zipFile);

    try {
      const res = await fetch(`${apiUrl}/api/manga/${selectedManga}/chapters`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to upload chapter");
      }

      toast.success("Chapter uploaded successfully!");
      setSelectedManga("");
      setChapterTitle("");
      setZipFile(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-2xl mx-auto bg-[#1e1e1e] p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Chapter</h2>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Manga Selection */}
          <div>
            <label className="block font-semibold mb-1">Select Comic</label>
            <select
              value={selectedManga}
              onChange={(e) => setSelectedManga(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-gray-500 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="" disabled>
                Select Comic title
              </option>
              {mangas.map((manga) => (
                <option key={manga._id} value={manga._id} className="bg-[#2a2a2a] text-white">
                  {manga.title}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter Title */}
          <div>
            <label className="block font-semibold mb-1">Chapter Title</label>
            <input
              type="text"
              className="w-full bg-transparent border border-gray-500 px-4 py-2 rounded-lg text-white focus:outline-none"
              placeholder="Enter chapter name"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
            />
          </div>

          {/* Zip File Upload */}
          <div>
            <label className="block font-semibold mb-1">Upload Zip File</label>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-500"
            />
            <p className="text-sm text-gray-400 mt-1">
              Only .zip files containing chapter images are allowed.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg w-full"
          >
            Upload Chapter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChapter;
