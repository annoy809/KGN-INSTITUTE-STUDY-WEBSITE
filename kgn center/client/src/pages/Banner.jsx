import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../assets/Styles/Banner.css';

// Images (adjust the paths accordingly)
import Banner1 from '../assets/images/banner1.jpeg';
import Banner2 from '../assets/images/banner2.jpg';
import Banner3 from '../assets/images/banner3.jpg';

const slides = [
  {
    image: Banner1,
    title: (
      <>
        Get a <span className="highlight">chance</span> to<br />
        win <span className="highlight">10% Discount</span>
      </>
    ),
    subtitle: 'Flexible courses. Expert instructors.\nLifelong learning',
    btn1Text: 'GET ENROLL',
    btn1Link: '/registration',
    btn2Text: 'Explore Courses',
    btn2Link: '/course-details',
    alt: 'Discount offer on online courses',
  },
  {
    image: Banner2,
    title: (
      <>
        Learn from <span className="highlight">Top Instructors</span><br />
        and get <span className="highlight">Certified</span>
      </>
    ),
    subtitle: 'Courses designed by experts.\nLearn anytime, anywhere.',
    btn1Text: 'Join Now',
    btn1Link: '/registration',
    btn2Text: 'Browse All',
    btn2Link: '/course-details',
    alt: 'Online learning with expert instructors',
  },
  {
    image: Banner3,
    title: (
      <>
        Unlock <span className="highlight">Lifetime Access</span><br />
        with one-time <span className="highlight">Enrollment</span>
      </>
    ),
    subtitle: 'Pay once. Learn forever.\nTrusted by 1000+ learners.',
    btn1Text: 'Start Learning',
    btn1Link: '/registration',
    btn2Text: 'View Details',
    btn2Link: '/course-details',
    alt: 'Unlimited access to course materials',
  },
];

function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Preload images to avoid flicker
  useEffect(() => {
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  return (
    <section className="discount-container" aria-label="Promotional course offers">
      <button className="carousel-arrow arrow-left" onClick={goToPrevious} aria-label="Previous Slide">
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button className="carousel-arrow arrow-right" onClick={goToNext} aria-label="Next Slide">
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      {slides.map((slide, index) => (
        <motion.article
          key={index}
          className="card logged"
          style={{
            backgroundImage: `url(${slide.image})`,
            position: index === currentSlide ? 'relative' : 'absolute',
            opacity: index === currentSlide ? 1 : 0,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card-right">
            <h1>{slide.title}</h1>

            <p className="subtext">
              {slide.subtitle.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>

            <div className="btn-group">
              <button className="btn primary" onClick={() => navigate(slide.btn1Link)}>
                {slide.btn1Text} <i className="fa-solid fa-angle-right"></i>
              </button>
              <button className="btn secondary" onClick={() => navigate(slide.btn2Link)}>
                {slide.btn2Text} <i className="fa-solid fa-angles-right"></i>
              </button>
            </div>

            <p className="disclaimer">
              * Valid for every 100 students user – T&C apply
            </p>
          </div>
        </motion.article>
      ))}
    </section>
  );
}

export default Banner;
