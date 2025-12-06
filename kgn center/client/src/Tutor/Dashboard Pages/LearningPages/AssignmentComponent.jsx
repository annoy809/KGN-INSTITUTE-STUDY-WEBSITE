import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignmentComponent = ({ assignment }) => {
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !answer) {
      toast.warning("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/submit-assignment", {

        assignmentId: assignment._id,
        courseId: assignment.courseId,
        name,
        answer,
      });

      toast.success(res.data.message || "Assignment submitted!");
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.info("You have already submitted this assignment.");
        setSubmitted(true);
      } else {
        console.error("Submission failed", err);
        toast.error("Failed to submit. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ld-block">
      <h2 className="ld-title">{assignment.title}</h2>
      <p className="ld-body">{assignment.body || "No description available."}</p>

      <input
        type="text"
        className="ld-input"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={submitted}
      />

      <textarea
        className="ld-textarea"
        placeholder="Write your answer here..."
        rows={6}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
      />

      <button
        className="ld-btn"
        onClick={handleSubmit}
        disabled={submitted || loading}
      >
        {submitted ? "Submitted ✅" : loading ? "Submitting..." : "Submit Assignment"}
      </button>

      {/* Toast container for notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default AssignmentComponent;
