import React, { useState } from 'react';
import axios from 'axios';
import './NewAdmission.css';

// Change this BASE_URL if you deploy
const BASE_URL = 'http://localhost:5000/api/admissions';

const NewAdmission = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    course: '',
    paymentStatus: 'pending',
    admissionDate: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Fallback for paymentStatus
      const payload = {
        ...formData,
        paymentStatus: formData.paymentStatus || 'pending'
      };

      // Make the POST request
      const res = await axios.post(BASE_URL, payload);
      
      if (res.data && res.data.success !== false) {
        setMessage('✅ Admission added successfully!');
        // Reset the form
        setFormData({
          studentName: '',
          email: '',
          phone: '',
          course: '',
          paymentStatus: 'pending',
          admissionDate: new Date().toISOString().split('T')[0],
        });
      } else {
        setMessage('❌ Failed to add admission. Please check your input.');
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.error
          ? `❌ ${error.response.data.error}`
          : '❌ Failed to add admission. Please try again.'
      );
    }

    setLoading(false);
  };

  return (
    <div className="new-admission-container">
      <h2>Add New Admission</h2>
      <form className="new-admission-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Payment Status</label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="form-group">
          <label>Admission Date</label>
          <input
            type="date"
            name="admissionDate"
            value={formData.admissionDate}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Admission'}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default NewAdmission;
