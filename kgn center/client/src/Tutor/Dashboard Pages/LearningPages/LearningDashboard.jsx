import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaBook,
  FaPuzzlePiece,
  FaClipboardList,
  FaPlayCircle,
} from "react-icons/fa";
import "./LearningDashboard.css";
import QuizComponent from "./QuizComponent";
import AssignmentComponent from "./AssignmentComponent";

const LearningDashboard = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeView, setActiveView] = useState("lesson");

  const [selectedOption, setSelectedOption] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [assignmentAnswer, setAssignmentAnswer] = useState("");
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Failed to fetch course", err);
      }
    };
  
    fetchCourse();
  }, [courseId]);
  

  const toggleTopic = (index) => {
    setActiveTopic((prev) => (prev === index ? null : index));
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setActiveView("lesson");
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedLesson(assignment);
    setActiveView("assignment");
    setAssignmentAnswer("");
    setAssignmentSubmitted(false);
  };

  const handleQuizClick = (quiz) => {
    setSelectedLesson(quiz);
    setActiveView("quiz");
    setSelectedOption(null);
    setQuizResult(null);
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    if (assignmentAnswer.trim() === "") {
      alert("Please enter your answer.");
      return;
    }
    // TODO: Send this answer to backend or store it
    setAssignmentSubmitted(true);
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (selectedOption === null) {
      alert("Please select an option.");
      return;
    }
    const isCorrect = selectedOption === selectedLesson.correctOptionIndex;
    setQuizResult(isCorrect ? "Correct ✅" : "Wrong ❌");
  };

  if (!course) return <div className="ld-loading">Loading course...</div>;

  return (
    <div className="ld-container">
      {/* ✅ Sidebar */}
      <aside className="ld-sidebar">
        <h2 className="ld-course-title">{course.title}</h2>
        <div className="ld-topic-list">
          {course.topics.map((topic, index) => (
            <div className="ld-topic" key={index}>
              <div
                className="ld-topic-header"
                onClick={() => toggleTopic(index)}
              >
                <h3>{topic.title}</h3>
                <span>{activeTopic === index ? "▲" : "▼"}</span>
              </div>

              {activeTopic === index && (
                <div className="ld-topic-body">
                  {topic.contents
                    .filter((c) => c.type === "Lesson")
                    .map((lesson, i) => (
                      <div
                        key={i}
                        className="ld-content-card"
                        onClick={() => handleLessonClick(lesson)}
                      >
                        <FaBook className="ld-icon" /> {lesson.title}
                      </div>
                    ))}

                  {topic.contents
                    .filter((c) => c.type === "Quiz")
                    .map((quiz, i) => (
                      <div
                        key={i}
                        className="ld-content-card"
                        onClick={() => handleQuizClick(quiz)}
                      >
                        <FaPuzzlePiece className="ld-icon" /> {quiz.title}
                      </div>
                    ))}

                  {topic.contents
                    .filter((c) => c.type === "Assignment")
                    .map((assignment, i) => (
                      <div
                        key={i}
                        className="ld-content-card"
                        onClick={() => handleAssignmentClick(assignment)}
                      >
                        <FaClipboardList className="ld-icon" /> {assignment.title}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* ✅ Main Content */}
   <main className="ld-content">
  {!selectedLesson ? (
    <div className="ld-placeholder">
      <FaPlayCircle size={60} />
      <p>Select a lesson, quiz, or assignment to begin</p>
    </div>
  ) : activeView === "lesson" ? (
    <>
      <h2 className="ld-title">{selectedLesson.title}</h2>
      {selectedLesson.video ? (
        <video controls autoPlay className="ld-video">
          <source src={selectedLesson.video} type="video/mp4" />
        </video>
      ) : (
        <p className="ld-no-video">No video available.</p>
      )}
      <div
  className="ld-body"
  dangerouslySetInnerHTML={{
    __html: selectedLesson.body.replace(/\n/g, "<br/>")
  }}
></div>

    </>
  ) : activeView === "quiz" ? (
    <QuizComponent quiz={selectedLesson} />
  ) : (
    <AssignmentComponent assignment={selectedLesson} />
  )}
</main>

    </div>
  );
};

export default LearningDashboard;
