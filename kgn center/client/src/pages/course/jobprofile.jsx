import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaEdit, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./jobprofile.css";
import defaultAvatar from "../../assets/images/dafaulticon.jpg";

const JobProfile = () => {
  const API_URL = "http://localhost:5000";

  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultAvatar);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    profession: "",
    skills: "",
    website: "",
    linkedin: "",
    phone: "",
    location: "",
    jobTitle: "",
  });

  const [backupProfile, setBackupProfile] = useState(null);

  // LOAD USER FROM LOCALSTORAGE
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    setProfile((prev) => ({ ...prev, ...savedUser }));
    setProfileImage(savedUser.profileImage || savedUser.picture || defaultAvatar);
  }, []);

  // FETCH USER FROM BACKEND
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          const userData = data.user || data;
          const old = JSON.parse(localStorage.getItem("user")) || {};

          const merged = { ...old, ...userData };
          localStorage.setItem("user", JSON.stringify(merged));

          setProfile(merged);
          setProfileImage(
            merged.profileImage || merged.picture || defaultAvatar
          );
        }
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  // IMAGE PREVIEW
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  // SAVE PROFILE
 
  return (
    <div className="jobprofile-container">
      <div className="jobprofile-card">
        <div className="jobprofile-header">
          <img src={profileImage} className="profile-avatar" alt="Profile" />
            <label className="upload-btn">
              Choose Image
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
            <>
              <h2>{profile.name || "Your Name"}</h2>
              <p className="job-title">{profile.jobTitle || "Your Job Title"}</p>
            </>
        </div>

        <div className="jobprofile-info">

          <div className="info-item">
            <FaEnvelope />
            <span>{profile.email}</span>
          </div>

          <div className="info-item">
            <FaPhone />
              <span>{profile.phone || "Not set"}</span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt />
              <span>{profile.location || "Not set"}</span>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default JobProfile;
