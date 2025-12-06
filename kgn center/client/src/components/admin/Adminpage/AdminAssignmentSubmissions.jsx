import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Admincss/AdminAssignmentSubmissions.css";

const AdminAssignmentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [submissions, search, dateFilter]);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("/api/submissions");
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    }
  };

  const applyFilters = () => {
    let data = [...submissions];

    if (search.trim()) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateFilter) {
      data = data.filter((s) =>
        new Date(s.createdAt).toDateString() === new Date(dateFilter).toDateString()
      );
    }

    setFiltered(data);
    setPage(1); // reset to first page
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="admin-container">
      <h1 className="admin-title">📋 Assignment Submissions</h1>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Search by student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student</th>
            <th>Assignment ID</th>
            <th>Course ID</th>
            <th>Answer</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan="6">No submissions found.</td>
            </tr>
          ) : (
            paginated.map((sub, i) => (
              <tr key={sub._id}>
                <td>{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td>{sub.name}</td>
                <td>{sub.assignmentId}</td>
                <td>{sub.courseId}</td>
                <td>{sub.answer}</td>
                <td>{new Date(sub.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            ◀ Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAssignmentSubmissions;
