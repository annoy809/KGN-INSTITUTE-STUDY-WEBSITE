import React, { useState, useContext } from "react";
import './CourseNavbar.css'
import { ChevronDown, CheckCircle, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseContext } from "./CourseContext";

const CourseNavbar = () => {
  const [activeStep, setActiveStep] = useState("Basics");
  const [publishMenuOpen, setPublishMenuOpen] = useState(false);
  const { courseData } = useContext(CourseContext);
  let navigate = useNavigate();
  const steps = ["Basics", "Curriculum", "Additional"];

  const handleStepClick = (step) => {
    setActiveStep(step);
    if (step === "Curriculum") {
      navigate("/course-builder");
    }
    if (step === "Basics") {
      navigate("/addcourse");
    }
    if (step === "Additional") {
      navigate("/additional");
    }
  };

  const handlePublishNow = async () => {
    try {
      console.log(courseData);
      const res = await fetch("http://localhost:5000/api/courses/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(courseData)
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Course published successfully!");
      } else {
        alert("❌ Failed to publish: " + data.error);
      }
    } catch (err) {
      alert("⚠️ Error: " + err.message);
      console.error("Publish error:", err);
    }
  };
  const handleSaveDraft = async () => {
  // Prepare your draft payload (similar to publish, but maybe with a draft flag)
  const draftPayload = {
    ...courseData,
    status: "draft", // or any field your backend uses to mark drafts
    // add other fields as needed
  };

  try {
    const res = await fetch("http://localhost:5000/api/courses/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftPayload),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Draft saved successfully!");
    } else {
      alert("❌ Failed to save draft: " + data.error);
    }
  } catch (err) {
    alert("⚠️ Error: " + err.message);
  }
};

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-left">
          <img
            src="https://i.ibb.co/L0FFpJG/tutor-lms-logo.png"
            alt="Tutor LMS Logo"
            className="logo"
          />
          <span className="brand-name">tutor <strong>LMS</strong></span>

          <div className="steps">
            <span className="course-builder">Course Builder</span>
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <span
                  className={`step ${activeStep === step ? "active" : ""}`}
                  onClick={() => handleStepClick(step)}
                >
                  {activeStep === step || steps.indexOf(activeStep) > index ? (
                    <CheckCircle size={16} className="icon" />
                  ) : (
                    <Circle size={16} className="icon" />
                  )}
                  {step}
                </span>
                {index < steps.length - 1 && <span className="divider">—</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

            
      </div>
    </>
  );
};

export default CourseNavbar;