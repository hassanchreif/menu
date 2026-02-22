import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CreateMemberModal.css";

export default function CreateMemberModal({
  token,
  onClose,
  onMemberCreated,
  member,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    subscriptionType: "monthly",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        gender: member.gender || "male",
        subscriptionType: member.subscriptionType || "monthly",
      });

      if (member.image) {
        setPreview(`http://localhost:5000/${member.image}`);
      }
    }
  }, [member]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("email", form.email);
      data.append("phone", form.phone);
      data.append("gender", form.gender);
      data.append("subscriptionType", form.subscriptionType);

      if (image) {
        data.append("image", image);
      }

      if (member) {
        await axios.put(
          `http://localhost:5000/api/members/${member._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/members",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      onMemberCreated();
      onClose();

    } catch (err) {
      console.error(err);
      setError("Failed to save member");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{member ? "Edit Member" : "Add New Member"}</h2>

        <form onSubmit={handleSubmit} className="member-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
          />

          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            name="subscriptionType"
            value={form.subscriptionType}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="6months">6 Months</option>
            <option value="yearly">Yearly</option>
          </select>

          {/* IMAGE SECTION */}
          <div className="image-upload-section">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="image-preview"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="create-btn">
              {member ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>

        {error && <p className="modal-error">{error}</p>}
      </div>
    </div>
  );
}