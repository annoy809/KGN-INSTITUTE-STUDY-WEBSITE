import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Admincss/AllRegistrations.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get("/api/registration");
        setRegistrations(res.data);
        setFiltered(sortByDate(res.data, "desc"));
      } catch (err) {
        toast.error("❌ Failed to load registrations.");
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const sortByDate = (data, order) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    const sorted = sortByDate(filtered, order);
    setFiltered(sorted);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const searched = registrations.filter((reg) =>
      [reg.firstName, reg.lastName, reg.email, reg.course].some((field) =>
        field?.toLowerCase().includes(value)
      )
    );
    setFiltered(sortByDate(searched, sortOrder));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;
    try {
      await axios.delete(`/api/registration/${id}`);
      const updated = registrations.filter((reg) => reg._id !== id);
      setRegistrations(updated);
      setFiltered(sortByDate(updated, sortOrder));
      toast.success("✅ Registration deleted.");
      setSelected(null);
    } catch {
      toast.error("❌ Could not delete registration.");
    }
  };

  // ✅ New: Manual Enroll Function
  const handleEnroll = async (id) => {
    const course = prompt("Enter course name to enroll:");
    const batch = prompt("Enter batch name:");
    if (!course || !batch) {
      return toast.warn("⚠️ Please enter both course and batch details.");
    }

    try {
      const res = await axios.post("/api/registration/enroll", {
        studentId: id,
        course,
        batch,
      });
      toast.success("✅ Student enrolled successfully!");
      console.log(res.data);

      // Optional: update frontend state
      const updated = registrations.map((r) =>
        r._id === id ? { ...r, course, batch, enrolled: true } : r
      );
      setRegistrations(updated);
      setFiltered(sortByDate(updated, sortOrder));
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to enroll student.");
    }
  };

  return (
    <div className="admin-page">
      <ToastContainer />
      <h2>📋 Registrations</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search name, email, course..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="reg-table">
            <thead>
              <tr>
                <th>👤 First Name</th>
                <th>👤 Last Name</th>
                <th>📧 Email</th>
                <th>📱 Phone</th>
                <th>🎓 Course</th>
                <th>🗓️ Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((reg) => (
                  <tr key={reg._id} onClick={() => setSelected(reg)}>
                    <td>{reg.firstName}</td>
                    <td>{reg.lastName}</td>
                    <td>{reg.email}</td>
                    <td>{reg.phone}</td>
                    <td>{reg.course}</td>
                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No matching registrations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              👤 {selected.firstName} {selected.lastName}
            </h3>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Phone:</strong> {selected.phone}</p>
            <p><strong>Course:</strong> {selected.course}</p>
            <p><strong>Center:</strong> {selected.center}</p>
            <p><strong>Batch:</strong> {selected.batch}</p>
            <p><strong>Education:</strong> {selected.education}</p>
            <p><strong>University:</strong> {selected.university}</p>
            <p><strong>Grade:</strong> {selected.grade}</p>
            <p><strong>Passout:</strong> {selected.passoutDate}</p>
            <p><strong>Father's Name:</strong> {selected.fatherName}</p>
            <p><strong>Mother's Name:</strong> {selected.motherName}</p>
            <p><strong>Father's Occupation:</strong> {selected.fatherOccupation}</p>
            <p><strong>Aadhar No:</strong> {selected.aadharNumber}</p>
            <p><strong>Card Number:</strong> {selected.cardNumber}</p>
            <p><strong>Expiry:</strong> {selected.expiry}</p>
            <p><strong>CVV:</strong> {selected.cvv}</p>
            <p>
              <strong>Registration Date:</strong>{" "}
              {new Date(selected.createdAt).toLocaleString()}
            </p>

            <div className="modal-actions">
              {/* ✅ New Button Added */}
              <button onClick={() => handleEnroll(selected._id)} className="enroll-btn">
                Enroll Student
              </button>

              <button onClick={() => handleDelete(selected._id)} className="delete-btn">
                Delete
              </button>
              <button onClick={() => setSelected(null)} className="close-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRegistrations;
