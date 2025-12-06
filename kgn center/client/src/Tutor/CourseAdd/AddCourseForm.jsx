import { useState, useContext, useEffect } from "react";
import './AddCourseForm.css';
import ScheduleCard from "./ScheduleCard";
import { CourseContext } from "./CourseContext";
import { useNavigate } from "react-router-dom";

const AddCourseForm = () => {
  const { courseData, setCourseData } = useContext(CourseContext);
  const [activeTab, setActiveTab] = useState("General");
  const [featuredImageURL, setFeaturedImageURL] = useState('');
  const [introVideoURL, setIntroVideoURL] = useState('');
  const navigate = useNavigate();
  const isValidCloudinaryUrl = (url) => {
    return url.includes("res.cloudinary.com") && url.includes("/upload/");
  };

  const categoriesList = [
    "Graphic Designing Course", "Web Development", "Data Science",
    "Digital Marketing", "Photography", "Music Production", "Business Management",
    "Mobile App Development", "Game Development", "AI & Machine Learning",
    "Cybersecurity", "Cloud Computing", "Blockchain Technology", "UI/UX Design","Website Design","Data analysis","Basic computer Course"
  ];

  const isValidCloudinaryVideoURL = (url) => {
    return (
      typeof url === 'string' &&
      url.includes("res.cloudinary.com") &&
      url.includes("/upload/") &&
      (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov") || url.endsWith(".mkv") || url.endsWith(".avi"))
    );
  };
  const isValidCloudinaryImageURL = (url) => {
    return (
      typeof url === 'string' &&
      url.includes("res.cloudinary.com") &&
      url.includes("/upload/") &&
      (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png") || url.endsWith(".webp") || url.endsWith(".gif") || url.endsWith(".avif"))
    );
  };

  const optimizeCloudinaryURL = (url) => {
    if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
    return url.replace("/upload/", "/upload/q_auto,f_auto/");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value;
    setCourseData(prev => ({ ...prev, [name]: val }));
  };


  useEffect(() => {
    setCourseData(prev => ({
      ...prev,
      featuredImage: optimizeCloudinaryURL(featuredImageURL || prev.featuredImage),
      introVideo: optimizeCloudinaryURL(introVideoURL || prev.introVideo),
    }));
  }, [featuredImageURL, introVideoURL]);

  const handleNextClick = () => {
    if (courseData.pricingModel === 'Paid') {
      const main = parseFloat(courseData.mainPrice);
      const regular = parseFloat(courseData.regularPrice);

      if (!main || !regular) {
        alert("Please enter both Main and Regular Price for paid courses.");
        return;
      }

      if (main > regular) {
        alert("Main Price should not be greater than Regular Price.");
        return;
      }
    }

    navigate('/course-builder');
  };

  return (
    <>
      <div className="course-form">
        <div className="left-panel">
          <div className="form-group">
            <label>Title <span>*</span></label>
            <input
              type="text"
              name="title"
              placeholder="New Course"
              value={courseData.title}
              onChange={handleChange}
              required
            />
            <p className="url">Course URL: <a href="#">https://yourdomain.com/courses/new-course</a></p>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="6"
              placeholder="Write course description here..."
              name="description"
              value={courseData.description}
              onChange={handleChange}
            />
          </div>

          <div className="tab-box">
            <div className="tabs">
              {['General', 'Content Drip', 'Enrollment'].map(tab => (
                <button
                  key={tab}
                  className={tab === activeTab ? 'active' : ''}
                  onClick={() => setActiveTab(tab)}
                >{tab}</button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === "General" && (
                <>
                  <div className="form-group">
                    <label>Difficulty Level</label>
                    <select name="difficultyLevel" value={courseData.difficultyLevel} onChange={handleChange}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>

                  <div className="toggle-group">
                    <input type="checkbox" name="isPublic" checked={courseData.isPublic} onChange={handleChange} />
                    <label>Public Course</label>
                  </div>

                  <div className="toggle-group">
                    <input type="checkbox" name="qnaEnabled" checked={courseData.qnaEnabled} onChange={handleChange} />
                    <label>Q&A Enabled</label>
                  </div>
                </>
              )}

              {activeTab === "Content Drip" && (
                <>
                  <div className="form-group">
                    <label>Drip Release Type</label>
                    <select name="dripType" value={courseData.dripType} onChange={handleChange}>
                      <option value="immediate">Release Immediately</option>
                      <option value="daysAfterEnroll">Release After Enrollment</option>
                      <option value="specificDate">Release On Specific Date</option>
                    </select>
                  </div>

                  {courseData.dripType === "daysAfterEnroll" && (
                    <div className="form-group">
                      <label>Release after (days)</label>
                      <input type="number" name="releaseAfterDays" value={courseData.releaseAfterDays} onChange={handleChange} />
                    </div>
                  )}

                  {courseData.dripType === "specificDate" && (
                    <div className="form-group">
                      <label>Release Date</label>
                      <input type="date" name="releaseDate" value={courseData.releaseDate} onChange={handleChange} />
                    </div>
                  )}
                </>
              )}

              {activeTab === "Enrollment" && (
                <>
                  <div className="enroll-toggle toggle-group">
                    <label>Enroll Students</label>
                    <label>
                      <input type="radio" name="enrollStudent" value={true} checked={courseData.enrollStudent === true} onChange={() => setCourseData(prev => ({ ...prev, enrollStudent: true }))} /> Yes
                    </label>
                    <label>
                      <input type="radio" name="enrollStudent" value={false} checked={courseData.enrollStudent === false} onChange={() => setCourseData(prev => ({ ...prev, enrollStudent: false }))} /> No
                    </label>
                  </div>

                  {courseData.enrollStudent && (
                    <div className="form-group">
                      <label>Maximum Students</label>
                      <input type="number" name="maxStudents" value={courseData.maxStudents} onChange={handleChange} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="form-group">
            <label>Visibility</label>
            <select name="visibility" value={courseData.visibility} onChange={handleChange}>
              <option>Public</option>
              <option>Private</option>
            </select>
            <div className="schedule-toggle">
              <ScheduleCard />
            </div>
          </div>

          <div className="form-group">
            <label>Featured Image URL (Cloudinary Only)</label>
            <input
              type="text"
              placeholder="Paste Cloudinary image URL"
              value={featuredImageURL}
              onChange={(e) => setFeaturedImageURL(e.target.value)}
              style={{
                borderColor: featuredImageURL && !isValidCloudinaryImageURL(featuredImageURL) ? "red" : undefined
              }}
            />
            {featuredImageURL && isValidCloudinaryImageURL(featuredImageURL) ? (
              <img
                src={optimizeCloudinaryURL(featuredImageURL)}
                alt="Preview"
                style={{ width: '150px', marginTop: '10px', borderRadius: '8px' }}
              />
            ) : featuredImageURL && (
              <p style={{ color: 'red', marginTop: '8px' }}>❌ Please enter a valid Cloudinary image URL.</p>
            )}
          </div>


          <div className="form-group">
            <label>Intro Video URL (Cloudinary Only)</label>
            <input
              type="text"
              placeholder="Paste Cloudinary video URL only"
              value={introVideoURL}
              onChange={(e) => setIntroVideoURL(e.target.value)}
              style={{
                borderColor: introVideoURL && !isValidCloudinaryVideoURL(introVideoURL) ? "red" : undefined
              }}
            />

            {introVideoURL && isValidCloudinaryVideoURL(introVideoURL) ? (
              <video
                src={optimizeCloudinaryURL(introVideoURL)}
                controls
                style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
              />
            ) : introVideoURL && (
              <p style={{ color: 'red', marginTop: '8px' }}>❌ Please enter a valid Cloudinary video URL.</p>
            )}
          </div>


          <div className="form-group">
            <label>Pricing Model</label>
            <label>
              <input type="radio" name="pricingModel" value="Free" checked={courseData.pricingModel === 'Free'} onChange={handleChange} /> Free
            </label>
            <label>
              <input type="radio" name="pricingModel" value="Paid" checked={courseData.pricingModel === 'Paid'} onChange={handleChange} /> Paid
            </label>
          </div>

          {courseData.pricingModel === 'Paid' && (
            <>
              <div className="form-group">
                <label>Regular Price</label>
                <input type="number" name="regularPrice" value={courseData.regularPrice || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Main Price</label>
                <input type="number" name="mainPrice" value={courseData.mainPrice || ''} onChange={handleChange} />
              </div>
              {courseData.mainPrice && courseData.regularPrice && courseData.regularPrice > courseData.mainPrice && (
                <p style={{ color: "green", marginTop: "-12px" }}>
                  Discount: ₹{(courseData.regularPrice - courseData.mainPrice).toFixed(2)} off (
                  {Math.round(
                    ((courseData.regularPrice - courseData.mainPrice) / courseData.regularPrice) * 100
                  )}%)
                </p>
              )}
            </>
          )}

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={courseData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categoriesList.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        className="next-button"
        onClick={handleNextClick}
        style={{ margin: "24px auto", display: "block", backgroundColor: "#007bff" }}
      >
        Next →
      </button>
    </>
  );
};

export default AddCourseForm;
