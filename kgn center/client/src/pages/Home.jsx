// Home.jsx
import React, { useEffect, Suspense } from 'react';
import '../assets/Styles/inquiryForm.css'; // Optional: remove if unused
import Preloader from '../components/Preloader';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';


// Lazy loaded components
import {
  Banner,
  Encourages,
  Courseshome,
  Footer,
  Testimonial,
  RegisterCTA,
  Determined,
  TrandingCourse
} from './LazyComponents';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Google login redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
      toast.success("Logged in via Google!");
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <div>
      {/* Individual Suspense for faster perceived load */}
      <Suspense fallback={<Preloader />}>
        <Banner />
      </Suspense>

      <Suspense fallback={<Preloader />}>
        <Encourages />
      </Suspense>

      <Suspense fallback={<Preloader />}>
        <Courseshome />
      </Suspense>

      <Suspense fallback={<Preloader />}>
        <Testimonial />
      </Suspense>

      <Suspense fallback={<Preloader />}>
        <Determined />
      </Suspense>

      <Suspense fallback={<Preloader />}>
        <RegisterCTA />
      </Suspense>

      <Suspense fallback={<Preloader />}>
        <TrandingCourse />
      </Suspense>

      <Suspense fallback={<Preloader />}>
        <Footer />
      </Suspense>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/917905903955"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/assets/images/whatsapp.webp" // Use local optimized WebP
          alt="WhatsApp"
          className="whatsapp-icon"
          width={48}
          height={48} // Prevent layout shift
          loading="lazy" // Lazy-load image
        />
      </a>
    </div>
  );
}

export default Home;
