import React from "react";
import "./cont.css";

const people = [
  {
    name: "Aditya Sharma",
    email: "aditya@example.com",
    phone: "+91 9876543210",
    designation: "Project Manager",
  },
  {
    name: "Riya Mehta",
    email: "riya@example.com",
    phone: "+91 8765432109",
    designation: "Frontend Developer",
  },
  {
    name: "Kabir Singh",
    email: "kabir@example.com",
    phone: "+91 9988776655",
    designation: "UI/UX Designer",
  },
];

export default function Banner() {
  return (
    <div className="banner-wrapper">
      <div className="banner-box">
        <h2 className="banner-title">Meet Our Team</h2>
        <div className="card-grid">
          {people.map((person, index) => (
            <div className="contact-card" key={index}>
              <h3>{person.name}</h3>
              <p><strong>Email:</strong> {person.email}</p>
              <p><strong>Phone:</strong> {person.phone}</p>
              <p><strong>Designation:</strong> {person.designation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
