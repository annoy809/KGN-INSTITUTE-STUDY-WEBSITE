import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import defaultAvatar from "../../src/assets/images/dafaulticon.jpg";

const EditProfile = () => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000"; // ❗YOUR BACKEND

  const [profileImage, setProfileImage] = useState(defaultAvatar);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profession: "",
    skills: "",
    website: "",
    linkedin: "",
  });

  // ⭐ Load User From LocalStorage on Component Mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || {};

    const savedImage =
      localStorage.getItem("profileImage") ||
      savedUser.profileImage ||        // custom uploaded
      savedUser.picture ||             // Google DP
      defaultAvatar;                   // fallback

    setProfileImage(savedImage);

    setFormData({
      name: savedUser.name || "",
      email: savedUser.email || "",
      bio: savedUser.bio || "",
      profession: savedUser.profession || "",
      skills: savedUser.skills || "",
      website: savedUser.website || "",
      linkedin: savedUser.linkedin || "",
    });
  }, []);

  // ⭐ Image Preview & Save Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        localStorage.setItem("profileImage", reader.result); // SAVE DP
      };
      reader.readAsDataURL(file);
    }
  };

  // ⭐ SAVE PROFILE → Send Token + Data to Backend
  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token missing, login again.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          profileImage: profileImage, // DP send
        }),
      });

      if (!res.ok) throw new Error("Failed to connect backend");

      const data = await res.json();

      if (data.user) {
        // Save complete updated user
        localStorage.setItem("user", JSON.stringify(data.user));

        // Save DP separately for quick profile loading
        if (data.user.profileImage) {
          localStorage.setItem("profileImage", data.user.profileImage);
        }

        navigate("/");
      } else {
        alert(data.msg);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Network error: Backend is not running.");
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card glass-card">
        <h2 className="edit-title">Edit Profile</h2>

        {/* Image */}
        <div className="profile-photo-section">
          <img
            src={profileImage || defaultAvatar}
            alt="Profile"
            className="profile-photo-preview"
          />

          <label htmlFor="profile-photo-upload" className="upload-btn">
            Change Photo
          </label>

          <input
            type="file"
            id="profile-photo-upload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Profession</label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) =>
                  setFormData({ ...formData, profession: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Skills</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group bio-section">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>

          <div className="social-section">
            <h3>🌐 Social Links</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
