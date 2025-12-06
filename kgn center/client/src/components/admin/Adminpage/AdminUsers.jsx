import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Admincss/AdminUsers.css";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

const USERS_PER_PAGE = 15;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]); // ✅ course list
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [enrollUser, setEnrollUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("❌ Failed to fetch users");
    }
  };

  // ✅ Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
    } catch {
      toast.error("⚠️ Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  // ✅ Filter + Sort
  const filtered = users
    .filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // ✅ Delete User
  const handleDelete = (user) => {
    setModalData({
      type: "delete",
      user,
      action: async () => {
        try {
          await axios.delete(
            `http://localhost:5000/api/auth/remove-user/${user._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("✅ User deleted");
          fetchUsers();
        } catch {
          toast.error("❌ Failed to delete user");
        } finally {
          setModalData(null);
        }
      },
    });
  };

  // ✅ Change Role
  const handleRoleChange = (user, newRole) => {
    if (user.role === "admin") {
      toast.error("🚫 Cannot change role of an Admin user");
      return;
    }
    if (newRole === user.role) return;

    setModalData({
      type: "role",
      user,
      action: async () => {
        try {
          await axios.patch(
            `http://localhost:5000/api/auth/update-role/${user._id}`,
            { role: newRole },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("✅ Role updated successfully");
          fetchUsers();
        } catch {
          toast.error("❌ Failed to update role");
        } finally {
          setModalData(null);
        }
      },
    });
  };

  // ✅ Enroll Submit (Course only)
  const handleEnrollSubmit = async () => {
    if (!selectedCourse) {
      toast.warn("⚠️ Please select a course");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/registration/enroll",
        {
          studentId: enrollUser._id,
          course: selectedCourse,
          enrolledByAdmin: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`🎓 ${enrollUser.username} enrolled successfully`);
      setEnrollUser(null);
      setSelectedCourse("");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to enroll student");
    }
  };

  return (
    <div className="admin-users">
      <h2>User Management</h2>

      {/* 🔹 Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* 🔹 Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <span className={`role-badge role-${u.role}`}>{u.role}</span>
              </td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u, e.target.value)}
                  disabled={u.role === "admin"}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="view-btn" onClick={() => setViewUser(u)}>
                  View
                </button>
                {u.role === "student" && (
                  <button
                    className="enroll-btn"
                    onClick={() => setEnrollUser(u)}
                  >
                    Enroll
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(u)}
                  disabled={u.role === "admin"}
                  title={
                    u.role === "admin"
                      ? "Admin users cannot be deleted"
                      : "Delete user"
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* 🔹 Confirm Modal */}
      {modalData && (
        <ConfirmModal
          title={modalData.type === "delete" ? "Delete User" : "Change Role"}
          message={
            modalData.type === "delete"
              ? `Are you sure you want to delete ${modalData.user.username}?`
              : `Are you sure you want to change role of ${modalData.user.username}?`
          }
          onConfirm={modalData.action}
          onCancel={() => setModalData(null)}
        />
      )}

      {/* 🔹 View User Modal */}
      {viewUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>User Details</h3>
            <p><strong>Username:</strong> {viewUser.username}</p>
            <p><strong>Email:</strong> {viewUser.email}</p>
            <p><strong>Phone:</strong> {viewUser.phone || "N/A"}</p>
            <p><strong>Role:</strong> {viewUser.role}</p>
            <p><strong>Verified:</strong> {viewUser.isVerified ? "Yes" : "No"}</p>
            <p><strong>Created:</strong> {new Date(viewUser.createdAt).toLocaleString()}</p>
            <button className="cancel-btn" onClick={() => setViewUser(null)}>Close</button>
          </div>
        </div>
      )}

      {/* 🔹 Enroll Modal (Only Course) */}
      {enrollUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enroll {enrollUser.username}</h3>

            {/* Course Dropdown */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="enroll-btn" onClick={handleEnrollSubmit}>
                Confirm Enroll
              </button>
              <button className="cancel-btn" onClick={() => setEnrollUser(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
