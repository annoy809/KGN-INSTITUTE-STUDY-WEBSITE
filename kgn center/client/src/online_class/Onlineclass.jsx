import React from 'react';
import './Onlineclass.css';
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';

const OnlineClasses = () => {
    const navigate = useNavigate();

const handleSelectPlan = (plan) => {
  navigate(`/Paymentplan?plan=${plan}`);
};

  return (
    <>
      <div className="membership-section">
        <h2>💼 Membership Plans</h2>
        <div className="plan-cards">
          <div className="plan-card">
            <h3>Beginner</h3>
            <p className="price">₹99 / month</p>
            <ul>
              <li>Access to 2 live classes/month</li>
              <li>Basic support</li>
              <li>Community Access</li>
              <li>Recorded sessions</li>
              <li>Beginner assignments</li>
              <li>Free webinars</li>
              <li>Group discussion access</li>
              <li>Course certificate</li>
              <li>Monthly feedback</li>
              <li>Email support</li>
              <li>Course progress tracking</li>
              <li>Career guidance</li>
              <li>Student forums</li>
              <li>Limited downloadable notes</li>
              <li>Basic quizzes</li>
            </ul>
                      <button className="plan-btn" onClick={() => handleSelectPlan("Beginner")}>
            Choose Beginner
          </button>
          </div>

          <div className="plan-card">
            <h3>Advance</h3>
            <p className="price">₹149 / month</p>
            <ul>
              <li>Access to 5 live classes/month</li>
              <li>Priority support</li>
              <li>Download materials</li>
              <li>Recorded sessions</li>
              <li>Advanced assignments</li>
              <li>Exclusive webinars</li>
              <li>Mock interviews</li>
              <li>Certificate of completion</li>
              <li>Personal feedback</li>
              <li>WhatsApp support</li>
              <li>Resume review</li>
              <li>Internship guidance</li>
              <li>Student community</li>
              <li>Interactive quizzes</li>
              <li>Access to doubt sessions</li>
            </ul>
                      <button className="plan-btn" onClick={() => handleSelectPlan("Advance")}>
            Choose Advance
          </button>
          </div>

          <div className="plan-card">
            <h3>Pro</h3>
            <p className="price">₹199 / month</p>
            <ul>
              <li>Unlimited live classes</li>
              <li>1-on-1 mentorship</li>
              <li>Certificate of completion</li>
              <li>Personalized career roadmap</li>
              <li>Access to premium courses</li>
              <li>Mock interviews with experts</li>
              <li>Exclusive job board access</li>
              <li>Internship & placement assistance</li>
              <li>Live project work</li>
              <li>24/7 chat support</li>
              <li>Dedicated mentor</li>
              <li>Monthly strategy calls</li>
              <li>Networking opportunities</li>
              <li>Advanced quizzes and tests</li>
              <li>Lifetime course access</li>
            </ul>
            <button className="plan-btn" onClick={() => handleSelectPlan("Pro")}>
            Choose Pro
          </button>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default OnlineClasses;
