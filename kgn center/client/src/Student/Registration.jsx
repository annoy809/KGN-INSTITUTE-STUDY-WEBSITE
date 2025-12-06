import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/Styles/MultiStepForm.css';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registration = () => {

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    education: '',
    university: '',
    grade: '',
    passoutDate: '',
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    aadharNumber: '',
    marksheet: null,
    course: '',
    center: '',
    batch: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    agreeTerms: false
  });

  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('registered') === 'true') {
      setAlreadyRegistered(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (files ? files[0] : value);
    setFormData({ ...formData, [name]: newValue });
    setErrors({ ...errors, [name]: '' });
  };

  const validateStep = () => {
    let newErrors = {};
    if (step === 1 && !formData.agreeTerms) newErrors.agreeTerms = 'You must accept the terms';
    if (step === 2) {
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'education', 'university',
        'grade', 'passoutDate', 'fatherName', 'motherName',
        'fatherOccupation', 'aadharNumber', 'marksheet', 'course',
        'center', 'batch'
      ];
      requiredFields.forEach(field => {
        if (!formData[field]) newErrors[field] = 'Required';
      });
    }
    if (step === 3) {
      if (!formData.cardNumber) newErrors.cardNumber = 'Required';
      if (!formData.expiry) newErrors.expiry = 'Required';
      if (!formData.cvv) newErrors.cvv = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => validateStep() && setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    if (alreadyRegistered) {
      toast.info('You have already registered during this session.');
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      const response = await axios.post('http://localhost:5000/api/registration/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        toast.success('Registration successful!');
        sessionStorage.setItem('registered', 'true');
        setAlreadyRegistered(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('You have already registered with this email or Aadhar.');
      } else if (error.response && error.response.data) {
        toast.error('Error: ' + error.response.data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  const renderInput = (name, placeholder, type = 'text') => (
    <div className="input-wrapper">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        value={type === 'file' ? undefined : formData[name]}
        className={`form-input ${errors[name] ? 'error' : ''}`}
        {...(type === 'file' ? { accept: 'application/pdf,image/*' } : {})}
      />
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </div>
  );

  const renderSelect = (name, options) => (
    <div className="input-wrapper">
      <select
        name={name}
        onChange={handleChange}
        value={formData[name]}
        className={`form-input ${errors[name] ? 'error' : ''}`}
      >
        <option value="">Select</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </div>
  );


  

  if (alreadyRegistered) {
    return <p className="reg-message">You have already registered during this session.</p>;
  }

  return (
    <>
      <div className="registration-container">
        <h2>Registration Form</h2>

        <div className="progress-bar">
          <div className={step >= 1 ? 'active' : ''} data-label="Terms">1</div>
          <div className={step >= 2 ? 'active' : ''} data-label="Info">2</div>
          <div className={step === 3 ? 'active' : ''} data-label="Payment">3</div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {step === 1 && (
     <div className="step-content">
              <h3>Terms and Conditions</h3>
              <p>By using our platform and purchasing any course, you agree to be bound by the following terms:</p>

              <p><strong>1. Eligibility:</strong> You must be at least 13 years old to use our services. If you're under 18, you need a parent or guardian's permission.</p>

              <p><strong>2. Account Responsibility:</strong> You are responsible for all activity on your account and keeping your password secure.</p>

              <p><strong>3. Course Access:</strong> After payment, course access is granted for the stated duration and cannot be shared or transferred.</p>

              <p><strong>4. Refund Policy:</strong> Refunds are not available after course access begins. Duplicate payments may be refunded upon request.</p>

              <p><strong>5. User Conduct:</strong> You agree not to copy, redistribute, or misuse the course materials or platform in any way.</p>

              <p><strong>6. Intellectual Property:</strong> All content is the property of Kgn Centre. Unauthorized use is prohibited.</p>

              <p><strong>7. Modifications:</strong> We may update these terms at any time. Please review them periodically.</p>

              <p><strong>8. Termination:</strong> Violation of these terms may result in account suspension or termination.</p>

              <p><strong>9. Disclaimer:</strong> We do not guarantee job placements or outcomes from completing our courses.</p>

              <p><strong>10. Privacy:</strong> Review our privacy policy to understand how we handle your data.</p>

              <p><strong>11. Governing Law:</strong> These terms are governed by the laws of [Your Country/State].</p>
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                I agree to the terms and conditions
              </label>
              {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3>User Information</h3>
              {renderInput('firstName', 'First Name')}
              {renderInput('lastName', 'Last Name')}
              {renderInput('email', 'Email')}
              {renderInput('phone', 'Phone No')}
              {renderSelect('education', ['Intermediate', 'Bachelor', 'Master'])}
              {renderInput('university', 'College / University')}
              {renderSelect('grade', ['A+', 'A', 'B'])}
              {renderInput('passoutDate', 'Passout Date', 'date')}
              {renderInput('fatherName', 'Father Name')}
              {renderInput('motherName', 'Mother Name')}
              {renderInput('fatherOccupation', 'Father Occupation')}
              {renderInput('aadharNumber', 'Aadhar Number')}
              {renderInput('marksheet', 'Upload Marksheet', 'file')}
              {renderSelect('course', ['Web And Mobile App', 'Graphic Design'])}
              {renderInput('center', 'Center')}
              {renderSelect('batch', ['Batch 1', 'Batch 2'])}
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3>Payment Details</h3>
              {renderInput('cardNumber', 'Card Number')}
              {renderInput('expiry', 'Expiry Date (MM/YY)')}
              {renderInput('cvv', 'CVV')}
            </div>
          )}

          <div className="button-group">
            {step > 1 && <button type="button" onClick={prevStep}>Back</button>}
            {step < 3 && <button type="button" onClick={nextStep}>Next</button>}
            {step === 3 && <button type="submit">Submit</button>}
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </>
  );
};

export default Registration;
