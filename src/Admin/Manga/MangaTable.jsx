import React, { useState } from "react";
import toast from "react-hot-toast";
import { useManga } from "../../ContextAPI/MangaContext.jsx";

const MangaTable = () => {
  const { mangas, refreshMangas } = useManga();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    genre: "",
    isRentable: false,
    rentalDetails: { price: "", duration: { value: "", unit: "days" } },
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const openUpdate = (m) => {
    setSelected(m);
    setFormData({
      title: m.title || "",
      description: m.description || "",
      author: m.author || "",
      genre: Array.isArray(m.genre) ? m.genre.join(", ") : m.genre || "",
      isRentable: m.isRentable || false,
      rentalDetails: {
        price: m.rentalDetails?.price ?? "",
        duration: {
          value: m.rentalDetails?.duration?.value ?? "",
          unit: m.rentalDetails?.duration?.unit ?? "days",
        },
      },
    });
    setIsModalOpen(true);
  };

  const closeUpdate = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("rentalDetails.")) {
      const [, field, sub] = name.split(".");
      setFormData((f) => {
        const rd = { ...f.rentalDetails };
        if (field === "duration") {
          rd.duration = { ...rd.duration, [sub]: value };
        } else {
          rd[field] = value;
        }
        return { ...f, rentalDetails: rd };
      });
    } else {
      setFormData((f) => ({
        ...f,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const submitUpdate = async () => {
    if (!formData.title || !formData.author || !formData.genre) {
      toast.error("Title, Author & Genre are required");
      return;
    }
    const payload = {
      title: formData.title,
      description: formData.description,
      author: formData.author,
      genre: formData.genre.split(",").map((g) => g.trim()),
      isRentable: formData.isRentable,
      rentalDetails: formData.isRentable
        ? {
            price: Number(formData.rentalDetails.price),
            duration: {
              value: Number(formData.rentalDetails.duration.value),
              unit: formData.rentalDetails.duration.unit,
            },
          }
        : null,
    };
    try {
      const res = await fetch(
        `${apiUrl}/api/manga/update/${selected._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error((await res.json()).message);
      toast.success("Updated!");
      refreshMangas();
      closeUpdate();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this manga?")) return;
    try {
      const res = await fetch(`${apiUrl}/api/manga/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).message);
      toast.success("Deleted");
      refreshMangas();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#121212] text-white font-[Montserrat]">
      <h2 className="text-3xl mb-6">All Manga</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-700 bg-[#1e1e1e] shadow-lg">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-[#2c2c2c] text-xs uppercase">
            <tr>
              <th className="px-6 py-3 border-b">Title</th>
              <th className="px-6 py-3 border-b">Author</th>
              <th className="px-6 py-3 border-b">Genre</th>
              <th className="px-6 py-3 border-b">Rentable</th>
              <th className="px-6 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {mangas.map((m) => (
              <tr key={m._id} className="hover:bg-[#292929]">
                <td className="px-6 py-4">{m.title}</td>
                <td className="px-6 py-4">{m.author}</td>
                <td className="px-6 py-4">{(m.genre || []).join(", ")}</td>
                <td className="px-6 py-4">
                  <span className={m.isRentable ? "text-green-400" : "text-red-400"}>
                    {m.isRentable ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => openUpdate(m)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] w-full max-w-md rounded-xl shadow-lg overflow-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl">Update Manga</h3>
              <button onClick={closeUpdate} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block mb-1">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#2a2a2a] rounded border border-gray-600"
                />
              </div>
              {/* Description */}
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#2a2a2a] rounded border border-gray-600 resize-none"
                />
              </div>
              {/* Author & Genre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Author</label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#2a2a2a] rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block mb-1">Genre</label>
                  <input
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    placeholder="Action, Fantasy"
                    className="w-full px-3 py-2 bg-[#2a2a2a] rounded border border-gray-600"
                  />
                </div>
              </div>
              {/* Rentable toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isRentable"
                  checked={formData.isRentable}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label>Rentable</label>
              </div>
              {/* Rental Details */}
              {formData.isRentable && (
                <div className="p-4 bg-[#2a2a2a] rounded border border-gray-600 space-y-4">
                  <h4 className="font-semibold text-yellow-400">Rental Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Price (Rs)</label>
                      <input
                        type="number"
                        name="rentalDetails.price"
                        value={formData.rentalDetails.price}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 bg-[#1e1e1e] rounded border border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Duration</label>
                   <div className="flex gap-2">
  <input
    type="number"
    name="rentalDetails.duration.value"
    value={formData.rentalDetails.duration.value}
    onChange={handleChange}
    min="1"
    className="w-20 px-3 py-2 bg-[#1e1e1e] rounded border border-gray-700"
  />
  <select
    name="rentalDetails.duration.unit"
    value={formData.rentalDetails.duration.unit}
    onChange={handleChange}
    className="w-28 px-3 py-2 bg-[#1e1e1e] rounded border border-gray-700"
  >
    <option value="hours">Hours</option>
    <option value="days">Days</option>
  </select>
</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-700">
              <button
                onClick={submitUpdate}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Save
              </button>
              <button
                onClick={closeUpdate}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangaTable;
