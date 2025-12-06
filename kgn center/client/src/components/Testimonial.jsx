import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../assets/Styles/Testimonial.css';

const testimonials = [
  {
    quote: "I learned everything from HTML to React in the Web Development course. The structure was smooth and the support from mentors made the journey enjoyable.",
    name: "Ankush Singh",
    title: "Full Stack Developer Intern",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
  },
  {
    quote: "The Python course was just amazing. From basics to advanced libraries like NumPy, Pandas, and Flask — it helped me build real applications confidently.",
    name: "Ankush Singh",
    title: "Python & App Developer",
    image: "https://randomuser.me/api/portraits/men/30.jpg",
  },
  {
    quote: "I started from zero and now I can create beautiful, responsive websites. Thanks to the Web Dev course, I’m freelancing confidently and building a portfolio.",
    name: "Harjeet Kaur",
    title: "Freelance Web Developer",
    image: "https://randomuser.me/api/portraits/women/43.jpg",
  },
  {
    quote: "Learning WordPress here was a game changer. I can now design and manage client websites with ease. The course was practical and full of live projects.",
    name: "Anwar Shaikh",
    title: "WordPress Developer",
    image: "https://randomuser.me/api/portraits/men/66.jpg",
  },
  {
    quote: "Thanks to this course, I finally understand JavaScript, DOM, and APIs. My confidence in building frontend apps has skyrocketed.",
    name: "Aadi Joshi",
    title: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/men/27.jpg",
  },
  {
    quote: "I was scared of code but not anymore. The course is designed for beginners like me — each concept is explained so clearly that learning felt natural.",
    name: "Ankush Singh",
    title: "Beginner to Developer Journey",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <h2>What Our Learners Are Saying</h2>
      <p className="testimonial-subtext">
        Real experiences, real impact — hear directly from our students about how our courses transformed their careers.
      </p>
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={true}
        centeredSlides={true}
        slidesPerView={1.2}
        spaceBetween={10}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
        className="testimonial-swiper"
      >
        {testimonials.map((t, index) => (
          <SwiperSlide key={index}>
            <div className="testimonial-card">
              <div className="quote-mark">“</div>
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-user">
                <img src={t.image} loading='lazy' alt={t.name} className="user-img" />
                <div>
                  <p className="user-name">{t.name}</p>
                  <p className="user-title">{t.title}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
  