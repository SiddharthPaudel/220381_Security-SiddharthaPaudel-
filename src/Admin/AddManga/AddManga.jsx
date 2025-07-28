import React, { useState } from "react";
import toast from "react-hot-toast";
import { useManga } from "../../ContextAPI/MangaContext.jsx"; // Import the context

const AddManga = () => {
  const { addManga, refreshMangas } = useManga(); // Use the context
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isRentable: false,
    author: "",
    genre: "",
    coverImage: null,
    rentalDetails: {
      price: "",
      duration: {
        value: "",
        unit: "days"
      }
    }
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      
      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else if (name.startsWith("rentalDetails.")) {
      const [parent, child, grandchild] = name.split(".");
      if (grandchild) {
        // For nested objects like duration.value or duration.unit
        let processedValue = value;
        if (type === "number") {
          // Only convert to number if value is not empty
          processedValue = value === "" ? "" : parseFloat(value) || "";
        }
        
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: {
              ...formData[parent][child],
              [grandchild]: processedValue
            }
          }
        });
      } else {
        // For direct children like price
        let processedValue = value;
        if (type === "number") {
          // Only convert to number if value is not empty
          processedValue = value === "" ? "" : parseFloat(value) || "";
        }
        
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: processedValue
          }
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, coverImage: null });
    setImagePreview(null);
    
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate rentable manga fields
    if (formData.isRentable) {
      if (!formData.rentalDetails.price || parseFloat(formData.rentalDetails.price) <= 0) {
        toast.error('Please enter a valid rental price for rentable manga', {
          duration: 4000,
          position: 'top-right',
        });
        return;
      }
      
      if (!formData.rentalDetails.duration.value || parseInt(formData.rentalDetails.duration.value) <= 0) {
        toast.error('Please enter a valid rental duration for rentable manga', {
          duration: 4000,
          position: 'top-right',
        });
        return;
      }
    }
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('isRentable', formData.isRentable);
      submitData.append('author', formData.author);
      submitData.append('genre', formData.genre);
      
      if (formData.coverImage) {
        submitData.append('coverImage', formData.coverImage);
      }
      
      // Only include rental details if the manga is rentable AND has valid values
      if (formData.isRentable && formData.rentalDetails.price && formData.rentalDetails.duration.value) {
        const rentalDetails = {
          price: parseFloat(formData.rentalDetails.price),
          duration: {
            value: parseInt(formData.rentalDetails.duration.value),
            unit: formData.rentalDetails.duration.unit
          }
        };
        submitData.append('rentalDetails', JSON.stringify(rentalDetails));
      }
      
      // Make API call to your backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const token = localStorage.getItem('token'); // or use context/auth state

const response = await fetch(`${apiUrl}/api/manga`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}` // 🔐 Pass token
  },
  body: submitData // this must be FormData (for file uploads)
});
      
      if (response.ok) {
        const result = await response.json();
        console.log('Manga added successfully:', result);
        
        // Instead of trying to add the manga optimistically,
        // just refresh the entire list to ensure consistency
        refreshMangas();
        
        toast.success('Manga added successfully!', {
          duration: 3000,
          position: 'top-right',
        });
        
        // Reset form after successful submission
        setFormData({
          title: "",
          description: "",
          isRentable: false,
          author: "",
          genre: "",
          coverImage: null,
          rentalDetails: {
            price: "",
            duration: {
              value: "",
              unit: "days"
            }
          }
        });
        
        // Reset image preview
        setImagePreview(null);
        
        // Clear the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        const errorData = await response.json();
        console.error('Error adding manga:', errorData);
        toast.error(`Failed to add manga: ${errorData.error || 'Unknown error'}`, {
          duration: 4000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error: Failed to connect to server', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Manga</h2>
        <div className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 px-4 py-2 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 px-4 py-2 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-transparent border border-gray-500 px-4 py-2 rounded-lg text-white resize-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Genre (comma-separated)</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-500 px-4 py-2 rounded-lg text-white"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isRentable"
              checked={formData.isRentable}
              onChange={handleChange}
              className="accent-yellow-400"
            />
            <label className="font-semibold">Is Rentable</label>
          </div>

          {/* Rental Details Section - Only show when isRentable is true */}
          {formData.isRentable && (
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Rental Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">Rental Price</label>
                  <input
                    type="number"
                    name="rentalDetails.price"
                    value={formData.rentalDetails.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-transparent border border-gray-500 px-4 py-2 rounded-lg text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Duration</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="rentalDetails.duration.value"
                      value={formData.rentalDetails.duration.value}
                      onChange={handleChange}
                      min="1"
                      className="flex-1 bg-transparent border border-gray-500 px-4 py-2 rounded-lg text-white"
                      placeholder="1"
                      required={formData.isRentable}
                    />
                    <select
                      name="rentalDetails.duration.unit"
                      value={formData.rentalDetails.duration.unit}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-500 px-4 py-2 rounded-lg text-white"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block mb-1 font-semibold">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              onChange={handleChange}
              className="text-white mb-4"
              accept="image/*"
              required
            />
            
            {/* Image Preview Section */}
            {imagePreview && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-yellow-400">Image Preview:</h4>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="max-w-xs max-h-64 object-contain rounded-lg border border-gray-500"
                  />
                </div>
                {formData.coverImage && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {formData.coverImage.name} ({(formData.coverImage.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Add Manga
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddManga;