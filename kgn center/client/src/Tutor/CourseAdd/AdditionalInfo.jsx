import React, { useContext, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import './AdditionalInfo.css';
import { CourseContext } from './CourseContext';
import Preloader from '../../components/Preloader';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdditionalInfo = () => {
  const navigate = useNavigate();
  const {
    courseData,
    resetCourse,
    additionalInfoForm: form,
    setAdditionalInfoForm: setForm,
  } = useContext(CourseContext);
  const [wasUpdated, setWasUpdated] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (courseData && courseData._id) {
      setForm({
        overview: courseData.overview || "",
        whatYouLearn: (courseData.whatWillLearn || []).join('\n'),
        targetAudience: (courseData.targetAudience || []).join('\n'),
        durationHours: courseData.duration?.hours || 0,
        durationMinutes: courseData.duration?.minutes || 0,
        materials: (courseData.materialsIncluded || []).join('\n'),
        requirements: (courseData.requirements || []).join('\n'),
        studentName: courseData.studentName || "",
        courseName: courseData.title || "",
        startDate: courseData.startDate ? courseData.startDate.slice(0, 10) : "",
        endDate: courseData.endDate ? courseData.endDate.slice(0, 10) : "",
        certDurationMonths: courseData.certDurationMonths || "",
        certType: courseData.certType || "Completion",
      });
    }
  }, [courseData, setForm]);

  const generateSlug = (title) => {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.random().toString(36).substr(2, 5)
    );
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
const handleSubmit = async () => {
  if (!form.overview || !form.whatYouLearn || !form.targetAudience) {
    toast.error("Please fill all required fields.");
    return;
  }

  setIsLoading(true);

  try {
    const combinedData = {
      ...courseData,
      title: courseData.title?.trim() || "Untitled Course",
      slug: courseData.slug?.trim()
        ? courseData.slug
        : generateSlug(courseData.title || "untitled"),
      description: courseData.description || "",
      pricingModel: courseData.pricingModel || "Free",
      category: courseData.category || "",
      difficultyLevel: courseData.difficultyLevel || "Beginner",
      featuredImage: courseData.featuredImage || "",
      introVideo: courseData.introVideo || "",
      enrollmentType: courseData.enrollmentType || "Open",
      enrollmentDeadline: courseData.enrollmentDeadline || null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      dripType: courseData.dripType || "none",
      tags: courseData.tags || [],
      topics: courseData.topics || [],
      overview: form.overview?.trim() || "",
      whatWillLearn: form.whatYouLearn
        ? form.whatYouLearn.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      targetAudience: form.targetAudience
        ? form.targetAudience.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      duration: {
        hours: Number.isFinite(parseInt(form.durationHours, 10))
          ? parseInt(form.durationHours, 10)
          : 0,
        minutes: Number.isFinite(parseInt(form.durationMinutes, 10))
          ? parseInt(form.durationMinutes, 10)
          : 0,
      },
      materialsIncluded: form.materials
        ? form.materials.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      requirements: form.requirements
        ? form.requirements.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      studentName: form.studentName?.trim() || "",
      courseName: form.courseName?.trim() || "",
      certDurationMonths: parseInt(form.certDurationMonths, 10) || 0,
      certType: form.certType || "Completion",
      regularPrice: parseFloat(courseData.regularPrice) || 0,
      mainPrice: parseFloat(courseData.mainPrice) || 0,
      status: "draft"
    };

    let res; // ✅ Declare here
    if (courseData._id) {
      setWasUpdated(true); // ✅ Track update status
      res = await axios.put(
        `http://localhost:5000/api/courses/${courseData._id}`,
        combinedData
      );
    } else {
      setWasUpdated(false); // ✅ Track create status
      res = await axios.post(
        "http://localhost:5000/api/courses",
        combinedData
      );
    }

    if (res.status === 200 || res.status === 201) {
      toast.success(wasUpdated ? "✅ Course updated successfully" : "✅ Course saved as draft.");
      setShowSuccessModal(true);
      if (!courseData._id) resetCourse(); // ✅ Only reset on create
    } else {
      toast.error("⚠️ Unexpected server response.");
    }
  } catch (err) {
    console.error("❌ Error saving:", err);
    toast.error(`❌ ${err.response?.data?.error || err.message}`);
  } finally {
    setIsLoading(false);
  }
};


  const generatePDF = () => {
    const {
      studentName, courseName, startDate, endDate,
      certDurationMonths, certType, durationHours, durationMinutes
    } = form;

    if (!studentName || !courseName || !startDate || !endDate || !certDurationMonths || !certType) {
      toast.error("⚠️ Fill all certificate fields before downloading.");
      return;
    }

    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(28);
    doc.setTextColor('#2c3e50');
    doc.text('Certificate of Completion', pageWidth / 2, 80, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor('#2980b9');
    doc.text(studentName, pageWidth / 2, 140, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor('#34495e');
    doc.text('has successfully completed the course:', pageWidth / 2, 170, { align: 'center' });

    doc.setFontSize(20);
    doc.setTextColor('#27ae60');
    doc.text(courseName, pageWidth / 2, 200, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor('#7f8c8d');
    doc.text(`Course Duration: ${startDate} to ${endDate}`, pageWidth / 2, 230, { align: 'center' });
    doc.text(`Certificate Duration: ${certDurationMonths} month(s)`, pageWidth / 2, 255, { align: 'center' });
    doc.text(`Certificate Type: ${certType}`, pageWidth / 2, 280, { align: 'center' });
    doc.text(`Total Course Time: ${durationHours || '0'} hours and ${durationMinutes || '0'} minutes`, pageWidth / 2, 310, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor('#bdc3c7');
    doc.text('© 2025 Your Company Name. All rights reserved.', pageWidth / 2, 780, { align: 'center' });

    doc.save(`${studentName}_Certificate.pdf`);
  };

  return (
    <div className="additional-info-container">
      {isLoading && <Preloader />}

      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="section-title">📘 Additional Information</h2>

      <div className="form-box">
        <label>Overview</label>
        <textarea
          placeholder="Provide essential course information"
          value={form.overview}
          onChange={(e) => handleChange('overview', e.target.value)}
        />

        <label>What Will You Learn?</label>
        <textarea
          placeholder="List key takeaways (one per line)"
          value={form.whatYouLearn}
          onChange={(e) => handleChange('whatYouLearn', e.target.value)}
        />

        <label>Target Audience</label>
        <textarea
          placeholder="Specify target audience (one line per group)"
          value={form.targetAudience}
          onChange={(e) => handleChange('targetAudience', e.target.value)}
        />

        <div className="duration-fields">
          <label>Total Course Duration</label>
          <div className="duration-inputs">
            <input
              type="number"
              placeholder="Hours"
              min={0}
              value={form.durationHours}
              onChange={(e) => handleChange('durationHours', e.target.value)}
            />
            <input
              type="number"
              placeholder="Minutes"
              min={0}
              max={59}
              value={form.durationMinutes}
              onChange={(e) => handleChange('durationMinutes', e.target.value)}
            />
          </div>
        </div>

        <label>Materials Included</label>
        <textarea
          placeholder="List of provided assets (one per line)"
          value={form.materials}
          onChange={(e) => handleChange('materials', e.target.value)}
        />

        <label>Requirements / Instructions</label>
        <textarea
          placeholder="Additional info or instructions (one per line)"
          value={form.requirements}
          onChange={(e) => handleChange('requirements', e.target.value)}
        />
      </div>

      <div className="submit-wrapper">
        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Publishing..." : courseData._id ? "Update Course" : "Save & Continue"}
        </button>

        <button className="open-cert-btn" onClick={() => setShowCertificateModal(true)}>
          🎓 Open Certificate Section
        </button>
      </div>

      {showCertificateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowCertificateModal(false)}>✖</button>
            <h3 className="modal-title">🎓 Certificate</h3>
            <img
              src="https://cdn.tutor-lms.com/assets/certificate.png"
              alt="Certificate"
              className="certificate-image"
            />
            <p className="certificate-desc">
              Celebrate success with personalized certificates. Highlight student achievement and build their confidence with recognition.
            </p>
            <div className="certificate-form">
              <label>Student Name</label>
              <input
                type="text"
                placeholder="Enter student name"
                value={form.studentName}
                onChange={(e) => handleChange('studentName', e.target.value)}
              />
              <label>Course Name</label>
              <input
                type="text"
                placeholder="Enter course name"
                value={form.courseName}
                onChange={(e) => handleChange('courseName', e.target.value)}
              />
              <label>Course Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
              <label>Course End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
              <label>Certificate Duration (Months)</label>
              <input
                type="number"
                min={1}
                placeholder="Enter certificate validity in months"
                value={form.certDurationMonths}
                onChange={(e) => handleChange('certDurationMonths', e.target.value)}
              />
              <label>Certificate Type</label>
              <select
                value={form.certType}
                onChange={(e) => handleChange('certType', e.target.value)}
              >
                <option value="">Select certificate type</option>
                <option value="Completion">Completion</option>
                <option value="Participation">Participation</option>
                <option value="Excellence">Excellence</option>
                <option value="Merit">Merit</option>
              </select>
            </div>
            <button className="download-btn" onClick={generatePDF}>📥 Download Certificate PDF</button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="success-modal">
          <div className="modal-box">
            <h3>
              {wasUpdated ? "✅ Course Updated Successfully" : "✅ Course Published as Draft"}
            </h3>
            <p>
              {wasUpdated
                ? "Your course has been updated. All changes are saved."
                : "Your course has been saved. It will be published fully after admin verification."}
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}



      <div className="submit-wrapper">
        <button className="back-button" onClick={() => navigate('/course-builder')}>← Back</button>
      </div>
    </div>
  );
};

export default AdditionalInfo;
