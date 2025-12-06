import React, { useEffect, useState } from "react";

const QuizComponent = ({ quiz }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [remainingTime, setRemainingTime] = useState(quiz.timeLimit * 60); // in seconds
  const [attempts, setAttempts] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted || remainingTime <= 0) return;
    const timer = setInterval(() => {
      setRemainingTime((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingTime, submitted]);

  const handleSubmit = () => {
    if (attempts >= quiz.maxAttempts) return;
    setSubmitted(true);
    setAttempts((prev) => prev + 1);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isCorrect = selectedIndex === quiz.correctOptionIndex;

  return (
    <div className="ld-block">
      <div className="ld-quiz-header">
        <h2 className="ld-title">{quiz.title}</h2>
        <span className="ld-quiz-timer">Time Left: {formatTime(remainingTime)}</span>
      </div>
      <p className="ld-body">{quiz.body || "Choose the correct answer:"}</p>

      <ul className="ld-quiz-options">
        {quiz.options.map((opt, i) => (
          <li
            key={i}
            className={`ld-quiz-option ${selectedIndex === i ? "selected" : ""}`}
            onClick={() => setSelectedIndex(i)}
          >
            {opt || `Option ${i + 1}`}
          </li>
        ))}
      </ul>

      <button className="ld-btn" onClick={handleSubmit} disabled={submitted || remainingTime <= 0}>
        Submit
      </button>

      {submitted && (
        <p className={`ld-feedback ${isCorrect ? "correct" : "wrong"}`}>
          {isCorrect ? "Correct Answer ✅" : "Incorrect ❌"}
        </p>
      )}
    </div>
  );
};

export default QuizComponent;
