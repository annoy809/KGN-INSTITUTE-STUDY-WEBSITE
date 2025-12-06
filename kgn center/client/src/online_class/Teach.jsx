import React from 'react';
import './Teach.css';
import Footer from '../components/Footer';

const Teach = () => {
    return (
        <>
        <div className="teach-page">
            {/* Hero Section */}
            <section className="teach-hero">
                <div className="teach-hero-content">
                    <h1 className="teach-hero-title">Teach the World with KGN Centre</h1>
                    <p className="teach-hero-text">
                        Share your expertise, grow your brand, and earn income by creating impactful courses for learners everywhere.
                    </p>
                    <button className="teach-cta-btn">Start Teaching Today</button>
                </div>
            </section>

            {/* Why Teach Section */}
            <section className="teach-why">
                <h2 className="teach-section-title">Why Teach on KGN Centre?</h2>
                <div className="teach-card-grid">
                    <div className="teach-card">
                        <h3 className="teach-card-title">📈 Earn Income</h3>
                        <p className="teach-card-text">Monetize your skills and get paid for each enrollment in your course.</p>
                    </div>
                    <div className="teach-card">
                        <h3 className="teach-card-title">🌍 Reach Learners</h3>
                        <p className="teach-card-text">Join thousands of instructors reaching students across India and beyond.</p>
                    </div>
                    <div className="teach-card">
                        <h3 className="teach-card-title">🛠 Course Tools</h3>
                        <p className="teach-card-text">Record videos, create quizzes, and upload PDFs effortlessly with our platform.</p>
                    </div>
                    <div className="teach-card">
                        <h3 className="teach-card-title">🤝 Full Support</h3>
                        <p className="teach-card-text">From setup to launch, our team assists you at every step of your journey.</p>
                    </div>
                </div>
            </section>

            {/* Earnings Section */}
            <section className="teach-earnings">
                <h2 className="teach-section-title">Your Potential Earnings</h2>
                <p className="teach-earnings-subtext">
                    Calculate how much you can make as an instructor on KGN Centre.
                </p>
                <div className="teach-earning-grid">
                    <div className="teach-earning-card">
                        <h3 className="teach-earning-title">100 Students</h3>
                        <p className="teach-earning-amount">₹10,000 / month</p>
                    </div>
                    <div className="teach-earning-card">
                        <h3 className="teach-earning-title">500 Students</h3>
                        <p className="teach-earning-amount">₹50,000 / month</p>
                    </div>
                    <div className="teach-earning-card">
                        <h3 className="teach-earning-title">1000+ Students</h3>
                        <p className="teach-earning-amount">₹1,00,000+ / month</p>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="teach-steps">
                <h2 className="teach-section-title">How to Start Teaching</h2>
                <div className="teach-step-grid">
                    <div className="teach-step-card">
                        <div className="teach-step-number">1</div>
                        <h4 className="teach-step-title">Create Instructor Profile</h4>
                        <p className="teach-step-text">Add your photo, expertise, and experience to build credibility.</p>
                    </div>
                    <div className="teach-step-card">
                        <div className="teach-step-number">2</div>
                        <h4 className="teach-step-title">Build Your Course</h4>
                        <p className="teach-step-text">Record lessons, add PDFs, quizzes, and outline your curriculum.</p>
                    </div>
                    <div className="teach-step-card">
                        <div className="teach-step-number">3</div>
                        <h4 className="teach-step-title">Publish & Get Paid</h4>
                        <p className="teach-step-text">Launch your course and start earning as students enroll.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="teach-testimonials">
                <h2 className="teach-section-title">What Our Instructors Say</h2>
                <div className="teach-testimonial-grid">
                    <div className="teach-testimonial-card">
                        <p className="teach-testimonial-text">
                            "KGN Centre has helped me grow my student base and income without technical hassle. The support team is fantastic!"
                        </p>
                        <h4 className="teach-testimonial-name">— Priya Sharma, Data Science Instructor</h4>
                    </div>
                    <div className="teach-testimonial-card">
                        <p className="teach-testimonial-text">
                            "I launched 3 courses and built a steady income stream. Highly recommend to any educator looking to expand."
                        </p>
                        <h4 className="teach-testimonial-name">— Arjun Mehta, Web Developer</h4>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="teach-faq">
                <h2 className="teach-section-title">FAQs</h2>
                <div className="teach-faq-grid">
                    <div className="teach-faq-item">
                        <h4 className="teach-faq-question">Do I need prior teaching experience?</h4>
                        <p className="teach-faq-answer">No. If you have knowledge and communication skills, you can teach!</p>
                    </div>

                    <div className="teach-faq-item">
                        <h4 className="teach-faq-question">How do I get paid?</h4>
                        <p className="teach-faq-answer">You earn 50% of the course price each time your course is purchased. We send payouts monthly via UPI or bank transfer.</p>
                    </div>

                    <div className="teach-faq-item">
                        <h4 className="teach-faq-question">What kind of content can I upload?</h4>
                        <p className="teach-faq-answer">You can upload videos, PDFs, quizzes, assignments, and project files — all hosted securely on our platform.</p>
                    </div>

                    <div className="teach-faq-item">
                        <h4 className="teach-faq-question">Can I update my course later?</h4>
                        <p className="teach-faq-answer">Absolutely! You can add new videos, revise materials, or improve lessons any time after publishing.</p>
                    </div>
                </div>

            </section>

            {/* Final CTA */}
            <section className="teach-final-cta">
                <h2 className="teach-final-title">Start Teaching and Make an Impact Today</h2>
                <p className="teach-final-subtext">Join our growing instructor family and change lives with your skills.</p>
                <button className="teach-cta-btn">Join KGN Centre</button>
            </section>
        </div>
        <Footer/>
        </>
    );
};

export default Teach;
