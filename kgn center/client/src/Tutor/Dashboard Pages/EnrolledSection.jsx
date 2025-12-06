// EnrolledSection.jsx
import React, { useEffect, useState, useMemo } from "react";
import "./EnrolledSection.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const tabs = [
  { label: "Enrolled Courses" },
  { label: "Active Courses" },
  { label: "Completed Courses" },
];

const EnrolledSection = () => {
  const [activeTab, setActiveTab] = useState("Enrolled Courses");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ⭐ Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Login first to view your enrollments");
        setLoading(false);
        return;
      }

      // ⭐ Correct backend route
      const res = await axios.get(
        "http://localhost:5000/api/enrollments/my-enrollments",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEnrolledCourses(res.data || []);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      toast.error("Failed to fetch enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // ⭐ UPDATE STATUS
  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Correct backend route
      const res = await axios.put(
        "http://localhost:5000/api/enrollments/update-progress",
        {
          enrollmentId,
          progress: newStatus === "completed" ? 100 : 10,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedEnrollments = enrolledCourses.map((item) =>
        item._id === enrollmentId
          ? { ...item, status: newStatus }
          : item
      );

      setEnrolledCourses(updatedEnrollments);

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Error updating course status");
    }
  };

  // ⭐ REMOVE ENROLLMENT (DELETE API)
  const handleRemove = async (enrollmentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(
        `http://localhost:5000/api/enrollments/delete/${enrollmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const remaining = enrolledCourses.filter(
        (item) => item._id !== enrollmentId
      );
      setEnrolledCourses(remaining);

      toast.info("Course removed successfully");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove enrollment");
    }
  };

  // FILTER COURSES
  const filteredCourses = useMemo(() => {
    return enrolledCourses.filter((course) => {
      if (activeTab === "Enrolled Courses") return course.status === "enrolled";
      if (activeTab === "Active Courses") return course.status === "in-progress";
      if (activeTab === "Completed Courses") return course.status === "completed";
      return false;
    });
  }, [activeTab, enrolledCourses]);

  // SHORT DESCRIPTION
  const getShortDescription = (text) => {
    if (!text) return "";
    return text.split(" ").slice(0, 15).join(" ") + "...";
  };

  return (
    <div className="enrolled-main">
      <h2 className="dashboard-title">My Courses</h2>

      {/* Tabs */}
      <div className="enrolled-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className={`enrolled-tab${
              activeTab === tab.label ? " active" : ""
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-section">Loading courses...</div>
      ) : (
        <div className="enrolled-content">
          {filteredCourses.length === 0 ? (
            <>
              <img
                src="https://www.svgrepo.com/show/13695/no-data.svg"
                alt="No Data"
                className="enrolled-empty-img"
              />
              <div className="enrolled-empty-text">
                No Data Available in this Section
              </div>
            </>
          ) : (
            <div className="enrolled-grid">
              {filteredCourses.map((enroll) => (
                <div key={enroll._id} className="enrolled-card">
                  <img
                    src={
                      enroll.course?.featuredImage ||
                      "https://via.placeholder.com/300"
                    }
                    alt={enroll.course?.title || "Course"}
                    className="enrolled-card-img"
                  />

                  <div className="enrolled-card-content">
                    <h3 className="enrolled-card-title">
                      {enroll.course?.title}
                    </h3>

                    <p className="enrolled-card-description">
                      {getShortDescription(enroll.course?.description)}
                    </p>

                    {/* Badges */}
                    <div className="enrolled-badges">
                      <span className="badge level">
                        {enroll.course?.difficultyLevel || "N/A"}
                      </span>
                      <span className="badge category">
                        {enroll.course?.category || "N/A"}
                      </span>
                      <span className="badge price">
                        ₹{enroll.course?.price || 0}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="enrolled-actions">
                      {enroll.status === "enrolled" && (
                        <button
                          className="action-btn start"
                          onClick={() => {
                            handleStatusChange(enroll._id, "in-progress");
                            navigate(
                              `/dashboard/StartLearning/${enroll.course._id}`
                            );
                          }}
                        >
                          Start Learning
                        </button>
                      )}

                      {enroll.status === "in-progress" && (
                        <>
                          <button
                            className="action-btn continue"
                            onClick={() =>
                              navigate(
                                `/dashboard/StartLearning/${enroll.course._id}`
                              )
                            }
                          >
                            Continue Learning
                          </button>

                          <button
                            className="action-btn complete"
                            onClick={() =>
                              handleStatusChange(enroll._id, "completed")
                            }
                          >
                            Mark Completed
                          </button>
                        </>
                      )}

                      <button
                        className="action-btn remove"
                        onClick={() => handleRemove(enroll._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={2500} />
    </div>
  );
};

export default EnrolledSection;
