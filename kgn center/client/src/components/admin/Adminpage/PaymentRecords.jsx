import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Admincss/PaymentRecords.css"; // Your CSS file

const PaymentRecords = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/payments", {
        params: { search, sortBy, order, page, limit: 20 },
      });
      setPayments(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [search, sortBy, order, page]);

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <div className="payment-records-container">
      <h2>Payment Records</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by email, phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Date</option>
          <option value="amount">Amount</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Desc ⬇️</option>
          <option value="asc">Asc ⬆️</option>
        </select>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <table className="payment-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Payment ID</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} onClick={() => openModal(p)} className="clickable-row">
                <td>{p.userId?.username || "N/A"}</td>
                <td>{p.email}</td>
                <td>₹{(p.amount / 100).toFixed(2)}</td>
                <td>{p.razorpay_payment_id}</td>
                <td>{p.courseIds?.map((c) => c.title).join(", ")}</td>
                <td>{p.status}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          ◀ Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next ▶
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPayment && (
        <div className="payment-modal-overlay" onClick={closeModal}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Payment Details</h3>
            <button className="close-btn" onClick={closeModal}>✖</button>

            <p><strong>User:</strong> {selectedPayment.userId?.username || "N/A"}</p>
            <p><strong>Email:</strong> {selectedPayment.email}</p>
            <p><strong>Phone:</strong> {selectedPayment.contact}</p>
            <p><strong>Amount:</strong> ₹{(selectedPayment.amount / 100).toFixed(2)}</p>
            <p><strong>Order ID:</strong> {selectedPayment.razorpay_order_id}</p>
            <p><strong>Payment ID:</strong> {selectedPayment.razorpay_payment_id}</p>
            <p><strong>Status:</strong> {selectedPayment.status}</p>
            <p><strong>Method:</strong> {selectedPayment.method}</p>
            <p><strong>Date:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}</p>
            <p><strong>Courses:</strong> {selectedPayment.courseIds?.map((c) => c.title).join(", ")}</p>

            {selectedPayment.billingInfo && (
              <>
                <h4>Billing Information</h4>
                <p><strong>Name:</strong> {selectedPayment.billingInfo.fullName}</p>
                <p><strong>Address:</strong> {selectedPayment.billingInfo.address}, {selectedPayment.billingInfo.city}, {selectedPayment.billingInfo.state}, {selectedPayment.billingInfo.pincode}</p>
                <p><strong>Country:</strong> {selectedPayment.billingInfo.country}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRecords;
