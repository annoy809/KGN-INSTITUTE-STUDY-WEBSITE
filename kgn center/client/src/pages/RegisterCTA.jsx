import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Styles/RegisterCTA.css';


const RegisterCTA = () => {
  const navigate = useNavigate();

  

  return (
    <section className="cta-container">
      <h2 className="cta-heading">🎯 Take the First Step Toward Learning!</h2>
      <p className="cta-subtext">
        Create your account now and get access to 100+ premium courses.
      </p>
      <button className="cta-button" onClick={()=>navigate('/regestration')}>
        Register for Free
      </button>
      <p className="cta-note">🔒 Secure & Easy Sign-up | Takes less than 1 minute</p>
    </section>
  );
};

export default RegisterCTA;
