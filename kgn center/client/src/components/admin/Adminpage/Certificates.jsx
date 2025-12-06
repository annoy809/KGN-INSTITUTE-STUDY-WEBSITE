import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Adminpage.css";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/certificates")
      .then(res => {
        setCertificates(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const issueCertificate = async (studentId, courseId) => {
    try {
      const res = await axios.post("/api/certificates/issue", { studentId, courseId });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading certificates...</p>;

  return (
    <div className="admin-page-container">
      <h1>Certificates</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Date Issued</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map(c => (
            <tr key={c.id}>
              <td>{c.studentName}</td>
              <td>{c.courseName}</td>
              <td>{new Date(c.issuedAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => issueCertificate(c.studentId, c.courseId)}>
                  Issue Again
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Certificates;
