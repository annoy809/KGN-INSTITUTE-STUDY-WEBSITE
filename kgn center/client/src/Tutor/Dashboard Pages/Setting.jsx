// StudentSettings.jsx
import React, { useState, useEffect } from "react";
import "./Setting.css";
import defaultAvatar from "../../assets/images/dafaulticon.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";


  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };
const StudentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(getStoredUser());
  const [profile, setProfile] = useState({});
  const [backupProfile, setBackupProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(defaultAvatar);
  const [isLoggedIn, setIsLoggedIn] = useState(true)


  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsUpdates: false,
    courseReminders: true,
  });

    const [formData, setFormData] = useState({
      name: user?.username || user?.name || "Guest User",
      email: user?.email || "guest@example.com",
      photo:
        user?.avatar ||
        user?.picture ||
        user?.photo ||
        "https://via.placeholder.com/150/007bff/ffffff?text=U",
      phone: user?.phone || "",
    });
  



  // Load user from localStorage and backend
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const localUser = JSON.parse(localStorage.getItem("user")) || {};
        setProfile(localUser);
        setProfileImage(localUser.avatar || defaultAvatar);

        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const merged = { ...localUser, ...data.user };
          setProfile(merged);
          setProfileImage(merged.avatar || defaultAvatar);
          localStorage.setItem("user", JSON.stringify(merged));
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


    useEffect(() => {
      const handleStorage = () => {
        const newUser = getStoredUser();
        if (newUser) {
          setUser(newUser);
          setIsLoggedIn(true);
          setFormData({
            name: newUser.username || newUser.name || "Guest User",
            email: newUser.email || "guest@example.com",
            photo:
              newUser.avatar ||
              newUser.picture ||
              newUser.photo ||
              "https://via.placeholder.com/150/007bff/ffffff?text=U",
            phone: newUser.phone || "",
          });
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setFormData({
            name: "Guest User",
            email: "guest@example.com",
            photo: "https://via.placeholder.com/150/007bff/ffffff?text=U",
            phone: "",
          });
        }
      };
  
      handleStorage();
      window.addEventListener("storage", handleStorage);
  
      return () => {
        window.removeEventListener("storage", handleStorage);
      };
    }, []);

  // Profile field changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  // Password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
  };

  // Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setProfileImage(preview);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("avatar", file);

      const res = await fetch(`${API_BASE}/user/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Upload failed");

      setProfile((p) => ({ ...p, avatar: data.avatar }));
      setProfileImage(data.avatar);
      localStorage.setItem("user", JSON.stringify({ ...profile, avatar: data.avatar }));
    } catch (err) {
      console.error(err);
      alert("Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (!isEditMode) setBackupProfile({ ...profile });
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    setProfile(backupProfile);
    setProfileImage(backupProfile?.avatar || defaultAvatar);
    setIsEditMode(false);
  };

  // Save profile
  const handleSave = async () => {
    try {
      setSavingProfile(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");

      setProfile(data.user);
      setProfileImage(data.user.avatar || defaultAvatar);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("New password and confirm password do not match");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Password change failed");
      alert("Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Toggle notifications
  const toggleNotification = (key) => {
    setNotifications((n) => ({ ...n, [key]: !n[key] }));
  };

  if (loading) return <div className="settings-page container">Loading...</div>;

  return (
    <div className="settings-page container">
      <h1 className="settings-title">Profile Settings</h1>

      <div className="settings-grid">
        {/* Main Profile Info */}
        <div className="settings-column main-col">
          <section className="card profile-card">
            <div className="avatar-row">
              <img src={user?.profileImage || user?.picture || defaultAvatar} alt="Avatar" className="avatar-large" />
              {isEditMode && (
                <label className="btn subtle">
                  {uploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
              )}
            </div>

            <div className="form-grid">
              {["name", "email", "phone", "username", "dob"].map((field) => (
                <label className="field" key={field}>
                  <div className="field-label">{field === "dob" ? "Date of Birth" : field.charAt(0).toUpperCase() + field.slice(1)}</div>
                  {isEditMode ? (
                    <input
                      type={field === "dob" ? "date" : "text"}
                      name={field}
                      value={profile[field] ? (field === "dob" ? profile[field].split("T")[0] : profile[field]) : ""}
                      onChange={handleProfileChange}
                    />
                  ) : (
                    <div>{profile[field] || "Not set"}</div>
                  )}
                </label>
              ))}

              {/* Bio */}
              <label className="field">
                <div className="field-label">Bio</div>
                {isEditMode ? (
                  <textarea
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleProfileChange}
                    placeholder="Write something about yourself..."
                  />
                ) : (
                  <div>{profile.bio || "Not set"}</div>
                )}
              </label>

              {/* Social Links */}
              {["website", "linkedin", "twitter"].map((key) => (
                <label className="field" key={key}>
                  <div className="field-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  {isEditMode ? (
                    <input
                      type="text"
                      name={key}
                      value={profile[key] || ""}
                      onChange={handleProfileChange}
                    />
                  ) : (
                    <div>{profile[key] || "Not set"}</div>
                  )}
                </label>
              ))}
            </div>

            <div className="form-actions">
              {isEditMode ? (
                <>
                  <button className="btn primary" onClick={handleSave} disabled={savingProfile}>
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                  <button className="btn subtle" onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="btn primary" onClick={toggleEdit}>
                  Edit Profile
                </button>
              )}
            </div>
          </section>

          {/* Change Password - Only if not Google login */}
          {!(profile.googleId || profile.authProvider === "google") && (
            <section className="card profile-card">
              <h2>Change Password</h2>
              <div className="form-grid">
                <label className="field">
                  <div className="field-label">Current Password</div>
                  <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} />
                </label>
                <label className="field">
                  <div className="field-label">New Password</div>
                  <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} />
                </label>
                <label className="field">
                  <div className="field-label">Confirm New Password</div>
                  <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} />
                </label>
              </div>
              <button className="btn primary" onClick={handleChangePassword}>Change Password</button>
            </section>
          )}

          {/* Notifications */}
          <section className="card profile-card">
            <h2>Notifications & Preferences</h2>
            {Object.keys(notifications).map((key) => (
              <div key={key} className="notification-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={() => toggleNotification(key)}
                  />
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;  