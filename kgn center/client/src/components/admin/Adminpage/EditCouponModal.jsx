import React, { useState } from 'react';
import '../Admincss/Modal.css';

const EditCouponModal = ({ coupon, onClose, onSubmit }) => {
  const [form, setForm] = useState({ ...coupon });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Edit Coupon</h3>
        <form onSubmit={submit}>
          <input type="text" name="code" value={form.code} onChange={handleChange} required />
          <input type="number" name="discount" value={form.discount} onChange={handleChange} required />
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>
          <input type="number" name="minAmount" value={form.minAmount} onChange={handleChange} required />
          <input type="date" name="expiry" value={form.expiry.split('T')[0]} onChange={handleChange} required />
          <div className="modal-actions">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCouponModal;
