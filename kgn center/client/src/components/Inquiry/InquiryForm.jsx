import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../assets/Styles/inquiryForm.css';

const InquiryForm = ({ showForm, toggleForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 numbers';
    }
    if (!formData.course) newErrors.course = 'Please select a course';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Form Data:', formData);
    alert('Inquiry submitted successfully!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      message: ''
    });
    setErrors({});
    toggleForm();
  };
  return (
    <AnimatePresence>
      {showForm && (
        <>
          <motion.div
            className="inquiry-overlay"
            onClick={toggleForm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
         <motion.div
  className="inquiry-form-container"
  style={{ position: 'fixed', top: '50%', left: '50%', }}
  initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
  animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
  exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
  transition={{ type: 'spring', stiffness: 120 }}
>

            <h2 className="inquiry-title">Have a Question? Contact Us!</h2>
            <form onSubmit={handleSubmit} className="inquiry-form">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}

              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}

              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={errors.course ? 'error' : ''}
              >
                <option value="">-- Select Course --</option>
                <option value="web-dev">Web Development</option>
                <option value="ui-ux">UI/UX Design</option>
                <option value="python">Python Programming</option>
                <option value="marketing">Digital Marketing</option>
              </select>
              {errors.course && <span className="error-msg">{errors.course}</span>}

              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
              ></textarea>
              {errors.message && <span className="error-msg">{errors.message}</span>}

              <div className="inq-buttons">
                <button type="submit">Submit Inquiry</button>
               
              </div>
             
            </form>
            <div className="close-inq">             
            <button onClick={toggleForm}>Close</button></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InquiryForm;
