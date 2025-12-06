import React, { useState } from 'react';
import './BecomeInstructor.css';

const BecomeInstructor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    expertise: '',
    bio: '',
    message: '',
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'profilePicture') {
      setFormData({ ...formData, [id]: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📨 Form Data Submitted:', formData);

    // TODO: Add backend API submission with Axios
    alert("✅ Application submitted successfully!");
  };

  return (
    <div className="instructor-wrapper">
      <form className="instructor-form" onSubmit={handleSubmit}>
        <h2>🎓 Become an Instructor</h2>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact Number</label>
          <input
            type="tel"
            id="contact"
            placeholder="+91 9876543210"
            pattern="^\+?[0-9\s\-]{8,20}$"
            title="Please enter a valid international phone number"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expertise">Expertise</label>
          <input type="text" id="expertise" placeholder="e.g. Python, Math, Music..." value={formData.expertise} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Short Bio</label>
          <textarea id="bio" rows="4" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleChange} required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input type="file" id="profilePicture" accept="image/*" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="message">Why do you want to teach with us?</label>
          <textarea id="message" rows="4" placeholder="Write your message..." value={formData.message} onChange={handleChange} required></textarea>
        </div>

        <button type="submit" className="submit-btn">Submit Application</button>
      </form>
    </div>
  );
};

export default BecomeInstructor;
