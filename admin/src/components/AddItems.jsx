import React from "react";
import { useState } from "react";
import { styles } from "../assets/dummyAdmin";
import { FiUpload } from "react-icons/fi";
import axios from "axios";

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: 0,
    hearts: 0,
    total: 0,
    image: null,
    preview: "",
  });
  const [categories] = useState([
    "Breakfast",
    "Lunch",
    "Dinner",
    "Mexican",
    "Italian",
    "Desserts",
    "Drinks",
  ]);

  const [hoverRating, setHoverRating] = useState(0);

  const handdleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handdleImageUpload = (e) => {
    const file = e.target.file[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRating = (rating) => setFormData((prev) => ({ ...prev.rating }));

  const handleHearts = () =>
    setFormData((prev) => ({ ...prev, hearts: prev.hearts + 1 }));

  const handleSubmit = async (e) => {
    e.prventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "preview") return;
        payload.append(key, val);
      });
      const res = await axios.post("http://localhost:4000/api/items", payload, {
        headers: { "content-Type": "multipart/form-data" },
      });
    } catch (error) {}
  };
  return (
    <div className={styles.formWrapper}>
      <div className="max-w-4xl mx-auto">
        <h2 className={styles.formTitle}>Add New Menu Item</h2>

        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
          <div className={styles.uploadWrapper}>
            <label className={styles.uploadLabel}>
              {formData.preview ? (
                <img
                  src={formData.preview}
                  alt="preview"
                  className={styles.previewImage}
                />
              ) : (
                <div className="text-center p-4">
                  <FiUpload className={styles.uploadIcon} />
                  <p className={styles.uploadText}>
                    Click to upload product image
                  </p>
                </div>
              )}
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItems;
