import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseDetails.css";
import {
  FaRupeeSign,
  FaClock,
  FaUser,
  FaStar,
  FaCheckCircle,
  FaDownload,
  FaClipboardList,
} from "react-icons/fa";
import Preloader from "../../components/Preloader";
import TrandingCourse from "./TrandingCourse";
import Footer from "../../components/Footer";
import { CartContext } from "../../Cartcontext.jsx";
import { toast, ToastContainer } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [showFullMaterials, setShowFullMaterials] = useState(false);
  const [showFullAudience, setShowFullAudience] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        const fetchedCourse = res.data;

        // calculate duration if missing
        if (!fetchedCourse.duration?.hours) {
          let totalMinutes = 0;
          fetchedCourse.topics?.forEach((topic) =>
            topic.contents?.forEach((c) => {
              if (c.type === "Lesson" && c.video) totalMinutes += 10;
              if (c.timeLimit) totalMinutes += c.timeLimit;
            })
          );
          fetchedCourse.duration = {
            hours: Math.floor(totalMinutes / 60),
            minutes: totalMinutes % 60,
          };
        }

        setCourse(fetchedCourse);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <Preloader />;
  if (!course) return <p>Course not found.</p>;

  const totalLessons = course.topics?.reduce(
    (acc, t) => acc + (t.contents?.filter((c) => c.type === "Lesson").length || 0),
    0
  );

  const durationText = `${course.duration?.hours || 0}h ${course.duration?.minutes || 0}m`;

  const toggleTopic = (i) => setActiveTopic((prev) => (prev === i ? null : i));

  const isAlreadyEnrolled = () => {
    const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    return enrolled.some((c) => c.id === id || c._id === id);
  };

  const handleEnroll = () => {
    if (!course) return;
    if (isAlreadyEnrolled()) {
      toast.info("ℹ️ You have already enrolled in this course.");
      return;
    }

    const result = addToCart({ ...course, id: course._id, status: "enrolled" });

    if (result.success) {
      toast.success("🎉 Course added to cart!");
      setShowModal(true);
    } else {
      toast.error(result.message || "❌ Failed to add course.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      {showModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal">
            <h2>✅ Course Added</h2>
            <p>{course.title} has been successfully added.</p>
            <div className="cd-modal-actions">
              <button className="cd-modal-btn primary" onClick={() => navigate("/cart")}>
                Go to Cart
              </button>
              <button className="cd-modal-btn secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cd-container">
        {/* Banner */}
        <div
          className="cd-banner"
          style={{
            backgroundImage: `url(${course.banner || course.featuredImage || course.thumbnail})`,
          }}
        >
          <div className="cd-banner-content">
            <h1>{course.title}</h1>
            <p>
              {course.category} • {course.difficultyLevel}
            </p>
            {course.rating && (
              <div className="cd-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < Math.round(course.rating) ? "#FFD700" : "#ccc"} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="cd-main">
          {/* Left Column */}
          <div className="cd-left">
            {/* Description */}
            {course.description && (
              <section>
                <h2>Description</h2>
                <div
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{
                    __html: showFullDescription
                      ? course.description.replace(/\n/g, "<br/>")
                      : `${course.description.slice(0, 300).replace(/\n/g, "<br/>")}...`,
                  }}
                />
                {course.description.length > 300 && (
                  <button
                    className="cd-toggle-btn"
                    onClick={() => setShowFullDescription((prev) => !prev)}
                  >
                    {showFullDescription ? "Show Less ▲" : "Show More ▼"}
                  </button>
                )}
              </section>
            )}

            {/* Overview */}
            {course.overview && (
              <section>
                <h2>Overview</h2>
                <p>{showFullOverview ? course.overview : `${course.overview.slice(0, 300)}...`}</p>
                {course.overview.length > 300 && (
                  <button
                    className="cd-toggle-btn"
                    onClick={() => setShowFullOverview((prev) => !prev)}
                  >
                    {showFullOverview ? "Show Less ▲" : "Show More ▼"}
                  </button>
                )}
              </section>
            )}

            {/* What you'll learn */}
            {course.whatWillLearn?.length > 0 && (
              <section>
                <h2>What You'll Learn</h2>
                <div className="cd-learn-cards">
                  {course.whatWillLearn.map((item, i) => (
                    <div key={i} className="cd-learn-card">
                      <FaCheckCircle /> {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {course.skills?.length > 0 && (
              <section>
                <h2>Skills You'll Gain</h2>
                <div className="cd-skill-tags">
                  {course.skills.map((skill, i) => (
                    <span key={i} className="cd-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Course Content */}
            {course.topics?.length > 0 && (
              <section>
                <h2>Course Content</h2>
                <p>
                  {course.topics.length} topics • {durationText} • {totalLessons} lessons
                </p>
                <div className="cd-topics-list">
                  {course.topics.map((topic, i) => (
                    <div key={i} className="cd-topic">
                      <div className="cd-topic-title" onClick={() => toggleTopic(i)}>
                        <span>{topic.title}</span>
                        <span>{activeTopic === i ? "-" : "+"}</span>
                      </div>
                      {activeTopic === i && (
                        <div className="cd-topic-details">
                          {topic.contents?.map((content, idx) => (
                            <p key={idx} className={`cd-lesson-item ${content.type.toLowerCase()}`}>
                              {content.title}{" "}
                              {["Quiz", "Assignment"].includes(content.type) && (
                                <FaClipboardList title={content.type} />
                              )}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Materials Included */}
            {course.materialsIncluded?.length > 0 && (
              <section>
                <h2>Materials Included</h2>
                <ul>
                  {(showFullMaterials ? course.materialsIncluded : course.materialsIncluded.slice(0, 4)).map(
                    (m, i) => (
                      <li key={i}>
                        <FaDownload /> {m}
                      </li>
                    )
                  )}
                </ul>
                {course.materialsIncluded.length > 4 && (
                  <button
                    className="cd-toggle-btn"
                    onClick={() => setShowFullMaterials((prev) => !prev)}
                  >
                    {showFullMaterials ? "Show Less ▲" : "Show More ▼"}
                  </button>
                )}
              </section>
            )}

            {/* Target Audience */}
            {course.targetAudience?.length > 0 && (
              <section>
                <h2>Target Audience</h2>
                <ul>
                  {(showFullAudience ? course.targetAudience : course.targetAudience.slice(0, 4)).map(
                    (aud, i) => (
                      <li key={i}>{aud}</li>
                    )
                  )}
                </ul>
                {course.targetAudience.length > 4 && (
                  <button
                    className="cd-toggle-btn"
                    onClick={() => setShowFullAudience((prev) => !prev)}
                  >
                    {showFullAudience ? "Show Less ▲" : "Show More ▼"}
                  </button>
                )}
              </section>
            )}

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <section>
                <h2>Requirements</h2>
                <ul>
                  {course.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Reviews */}
            {course.reviews?.length > 0 && (
              <section>
                <h2>Student Reviews</h2>
                {course.reviews.map((r, i) => (
                  <div key={i} className="cd-review">
                    <div className="cd-review-header">
                      <strong>{r.user}</strong>
                      <span>
                        {[...Array(5)].map((_, idx) => (
                          <FaStar key={idx} color={idx < r.rating ? "#FFD700" : "#ccc"} />
                        ))}
                      </span>
                    </div>
                    <p>{r.comment}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Instructor */}
            {course.createdBy && (
              <section>
                <h2>Instructor</h2>
                <div className="cd-instructor">
                  <img
                    src={course.createdBy.photo || "https://via.placeholder.com/100"}
                    alt={course.createdBy.name}
                  />
                  <div>
                    <h3>{course.createdBy.name}</h3>
                    <p>{course.createdBy.bio}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Certificate */}
            {course.studentName && course.courseName && (
              <section>
                <h2>Certificate Preview</h2>
                <p>
                  {course.generateCertificateText?.() ||
                    `🎓 ${course.studentName} completed ${course.courseName}`}
                </p>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="cd-right">
            <div className="cd-card">
              {course.introVideo && (
                <video className="cdetail-intro-video" controls>
                  <source src={course.introVideo} type="video/mp4" />
                </video>
              )}

              <p>
                <FaRupeeSign />{" "}
                <strong>{course.pricingModel === "Free" ? "Free" : `₹${course.mainPrice}`}</strong>
              </p>

              {course.regularPrice && course.mainPrice < course.regularPrice && (
                <p className="cd-discount">Was ₹{course.regularPrice}</p>
              )}

              <h3>Course Info</h3>
              <p>
                <FaClock /> Duration: {durationText}
              </p>
              <p>Category: {course.category}</p>
              <p>
                <FaUser /> Instructor: {course.createdBy?.name}
              </p>
              <p>Level: {course.difficultyLevel || "Beginner"}</p>
              <p>Students Enrolled: {course.studentsEnrolled || 0}</p>

              <button
                className="cd-enroll"
                onClick={handleEnroll}
                disabled={isAlreadyEnrolled()}
              >
                {isAlreadyEnrolled() ? "Already Enrolled" : "Enroll Now"}
              </button>
            </div>
          </div>
        </div>

        <TrandingCourse />
      </div>

      <Footer />
    </>
  );
};

export default CourseDetails;
