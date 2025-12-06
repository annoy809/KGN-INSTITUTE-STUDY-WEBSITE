import React, { useState, useEffect } from 'react';
// Import the new CSS file for styling
import '../Admincss/AdminAnnouncementVerif.css';
import Modal from 'react-modal';

// Set the app root element for react-modal accessibility
Modal.setAppElement('#root');

// Custom styles for the modals
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

/**
 * AdminAnnouncementVerif component for managing announcement verification.
 * This version fetches data from a backend API and uses a separate CSS file for styling.
 */
const AdminAnnouncementVerif = () => {
  // State to hold the full list of announcements and the filtered/sorted list
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  // State for search, filter, and sort controls
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State for UI feedback and modal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // State for the details modal
  const [authorUsername, setAuthorUsername] = useState('N/A'); // State to store the fetched author's username

  // New state for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  // New state for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', content: '' });


  /**
   * Effect hook to fetch data from the API on component mount and when an update occurs.
   */
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError('');

        // Retrieve the JWT token from local storage for authentication
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in as an admin.');
        }

        // Make the fetch request with the Authorization header
        const response = await fetch('/api/announcements/admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Network response was not ok');
        }

        const data = await response.json();
        setAllAnnouncements(data);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError(err.message || 'Failed to load announcements. Please check your API connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [refreshTrigger]); // re-run effect when refreshTrigger changes

  /**
   * Effect hook to apply filtering, searching, and sorting.
   * This re-runs whenever the filter controls or the announcement list changes.
   */
  useEffect(() => {
    let tempAnnouncements = [...allAnnouncements];

    // 1. Filtering by status
    if (filterStatus !== 'all') {
      tempAnnouncements = tempAnnouncements.filter(announcement => announcement.status === filterStatus);
    }

    // 2. Searching by title and content
    if (searchTerm) {
      tempAnnouncements = tempAnnouncements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. Sorting by creation date
    tempAnnouncements.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortDirection === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setFilteredAnnouncements(tempAnnouncements);
    setCurrentPage(1); // Reset to the first page after any filter/sort/search change
  }, [allAnnouncements, filterStatus, searchTerm, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + itemsPerPage);

  // Handlers for pagination controls
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  /**
   * Fetches the author's username using their ID.
   * This function now uses the new, dedicated backend API route.
   * @param {string} authorId The ID of the author to fetch.
   */
  const fetchAuthorUsername = async (authorId) => {
    if (!authorId) {
      setAuthorUsername('N/A');
      return;
    }

    setAuthorUsername('Loading...');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authorization token missing. Please log in.');
      }

      // Call the new backend API route to get user details
      const response = await fetch(`/api/auth/users/${authorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ msg: `Server responded with status ${response.status}` }));
        throw new Error(errorData.msg || 'Failed to fetch author details.');
      }

      const { user } = await response.json();
      setAuthorUsername(user.username || `User ID: ${authorId}`);
    } catch (err) {
      console.error('Error fetching author username:', err);
      setAuthorUsername(`Error: ${err.message}`);
    }
  };

  // Handlers for action buttons
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token missing. Please log in.');
        return;
      }

      const response = await fetch(`/api/announcements/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve announcement');
      }

      console.log(`✅ Announcement ${id} approved successfully.`);
      // Trigger a re-fetch to update the UI
      setRefreshTrigger(prev => !prev);

    } catch (err) {
      console.error('Error approving announcement:', err);
      setError(err.message || 'Error approving announcement.');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token missing. Please log in.');
        return;
      }

      const response = await fetch(`/api/announcements/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject announcement');
      }

      console.log(`❌ Announcement ${id} rejected successfully.`);
      // Trigger a re-fetch to update the UI
      setRefreshTrigger(prev => !prev);
    } catch (err) {
      console.error('Error rejecting announcement:', err);
      setError(err.message || 'Error rejecting announcement.');
    }
  };

  // Handler to show the details of an announcement in a modal-like view
  const handleViewDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    // Now we can safely fetch the author's username
    fetchAuthorUsername(announcement.author);
  };

  // New Delete Handlers
  const openDeleteModal = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setAnnouncementToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!announcementToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/announcements/admin/${announcementToDelete._id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete announcement.');
      }

      console.log(`🗑️ Announcement ${announcementToDelete._id} deleted successfully by admin.`);
      setRefreshTrigger(prev => !prev);
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError(err.message || 'Error deleting announcement.');
      closeDeleteModal();
    }
  };

  // New Edit Handlers
  const openEditModal = (announcement) => {
    setAnnouncementToEdit(announcement);
    setEditFormData({ title: announcement.title, content: announcement.content });
    setShowEditModal(true);
  };
  
  const closeEditModal = () => {
    setAnnouncementToEdit(null);
    setEditFormData({ title: '', content: '' });
    setShowEditModal(false);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!announcementToEdit) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/announcements/admin/${announcementToEdit._id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update announcement.');
      }
      
      console.log(`✏️ Announcement ${announcementToEdit._id} updated successfully by admin.`);
      setRefreshTrigger(prev => !prev);
      closeEditModal();

    } catch (err) {
      console.error("Error updating announcement:", err);
      setError(err.message || "Failed to update announcement.");
      closeEditModal();
    }
  };

  // Helper function to render a status pill with CSS classes
  const StatusPill = ({ status }) => {
    let statusClass;
    switch (status) {
      case 'pending':
        statusClass = 'status-pending';
        break;
      case 'approved':
        statusClass = 'status-approved';
        break;
      case 'rejected':
        statusClass = 'status-rejected';
        break;
      default:
        statusClass = 'status-default';
    }
    return (
      <span className={`status-pill ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // --- Render logic for different states ---
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading announcements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="panel-container">
      <div className="panel-content">
        <h1 className="panel-title">Announcement Verification Panel</h1>
        
        {/* Control Panel: Search, Filter, Sort */}
        <div className="control-panel">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {/* Filter Dropdown */}
          <div className="filter-dropdown-wrapper">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-dropdown"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="filter-dropdown-icon">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Sort Buttons */}
          <div className="sort-buttons">
            <button
              onClick={() => setSortDirection('desc')}
              className={`sort-button ${sortDirection === 'desc' ? 'sort-active' : ''}`}
            >
              Sort by Date (Newest)
            </button>
            <button
              onClick={() => setSortDirection('asc')}
              className={`sort-button ${sortDirection === 'asc' ? 'sort-active' : ''}`}
            >
              Sort by Date (Oldest)
            </button>
          </div>
        </div>

        {/* Announcement List */}
        <div className="announcement-list">
          {currentAnnouncements.length > 0 ? (
            currentAnnouncements.map(announcement => (
              <div key={announcement._id} className="announcement-item">
                <div className="announcement-header">
                  <h3 className="announcement-title-item">{announcement.title}</h3>
                  <StatusPill status={announcement.status} />
                </div>
                <p className="announcement-date">
                  {new Date(announcement.createdAt).toLocaleString()}
                </p>
                <div className="announcement-content">
                  {announcement.content}
                </div>
                
                {/* Action Buttons */}
                <div className="action-buttons">
                  <button
                    onClick={() => handleApprove(announcement._id)}
                    className="action-button approve-button"
                    disabled={announcement.status !== 'pending'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(announcement._id)}
                    className="action-button reject-button"
                    disabled={announcement.status !== 'pending'}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => openEditModal(announcement)}
                    className="action-button edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(announcement)}
                    className="action-button delete-button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewDetails(announcement)}
                    className="action-button view-button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-announcements">No announcements found matching the criteria.</div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {Math.min(itemsPerPage, filteredAnnouncements.length - startIndex)} of {filteredAnnouncements.length} results
          </div>
          <div className="pagination-buttons">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            
            {/* Page Number Buttons */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`pagination-number ${currentPage === index + 1 ? 'pagination-active' : ''}`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || filteredAnnouncements.length === 0}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* View Details Modal */}
      {selectedAnnouncement && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Announcement Details</h3>
              <button onClick={() => setSelectedAnnouncement(null)} className="close-button">&times;</button>
            </div>
            <div className="modal-body">
              {Object.entries(selectedAnnouncement).map(([key, value]) => {
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                
                let displayValue;
                if (key === 'createdAt' || key === 'updatedAt') {
                  displayValue = new Date(value).toLocaleString();
                } else if (key === 'author') {
                  // Display the fetched author username
                  displayValue = authorUsername;
                } else if (Array.isArray(value) && value.length === 0) {
                  displayValue = 'None';
                } else if (value === null) {
                  displayValue = 'N/A';
                } else if (typeof value === 'object' && value !== null) {
                  displayValue = JSON.stringify(value); // Fallback for nested objects
                } else {
                  displayValue = value;
                }
                
                return (
                  <p key={key}>
                    <strong>{formattedKey}:</strong> {displayValue}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onRequestClose={closeDeleteModal} style={customModalStyles} contentLabel="Confirm Delete">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this announcement?</p>
        <div className="modal-actions">
          <button onClick={handleDelete} className="modal-button delete-button">Yes, Delete</button>
          <button onClick={closeDeleteModal} className="modal-button cancel-button">Cancel</button>
        </div>
      </Modal>

      {/* Edit Announcement Modal */}
      <Modal isOpen={showEditModal} onRequestClose={closeEditModal} style={customModalStyles} contentLabel="Edit Announcement">
        <h2>Edit Announcement</h2>
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={editFormData.title}
              onChange={handleEditChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              value={editFormData.content}
              onChange={handleEditChange}
              required
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="submit" className="modal-button edit-button">Save Changes</button>
            <button type="button" onClick={closeEditModal} className="modal-button cancel-button">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAnnouncementVerif;
