import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Admincss/CouponForm.css'; // Make sure this path is correct

const CouponForm = () => {
    const [form, setForm] = useState({
        code: '',
        discount: '',
        type: 'percentage',
        minAmount: '',
        expiry: '',
    });

    const [isLoading, setIsLoading] = useState(false); // Loading state for button

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true); // Start loading

        try {
            // Prepare data for backend: convert discount and minAmount to numbers
            // Note: HTML5 type="number" inputs return strings, so explicit conversion is good.
            // expiry needs to be a valid date string (ISO format is best)
            const dataToSend = {
                ...form,
                discount: parseFloat(form.discount),
                minAmount: parseFloat(form.minAmount),
                expiry: form.expiry ? new Date(form.expiry).toISOString() : '', // Convert to ISO string only if date is provided
            };

            const response = await axios.post('/api/coupons/add', dataToSend);
            toast.success(response.data.message || 'Coupon added successfully!');

            // Reset form after successful submission
            setForm({
                code: '',
                discount: '',
                type: 'percentage',
                minAmount: '',
                expiry: '',
            });

        } catch (err) {
            console.error('Coupon add error:', err.response || err); // Log full error response for debugging
            const errorMessage = err.response?.data?.message || 'Failed to add coupon. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    // Calculate today's date in YYYY-MM-DD format for min attribute in date input
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="coupon-container">
            <h2>Add New Coupon</h2>
            <form className="coupon-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="code">Coupon Code</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        required // HTML5 validation (basic, can be bypassed)
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="discount">Discount Value</label>
                    <input
                        type="number"
                        id="discount"
                        name="discount"
                        value={form.discount}
                        onChange={handleChange}
                        required
                        min="0" // HTML5 validation
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Discount Type</label>
                    <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                    >
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="minAmount">Minimum Order Amount</label>
                    <input
                        type="number"
                        id="minAmount"
                        name="minAmount"
                        value={form.minAmount}
                        onChange={handleChange}
                        required
                        min="0" // HTML5 validation
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input
                        type="date"
                        id="expiry"
                        name="expiry"
                        value={form.expiry}
                        onChange={handleChange}
                        required
                        min={getTodayDateString()} // HTML5 min attribute
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Adding Coupon...' : 'Add Coupon'}
                </button>
            </form>
        </div>
    );
};

export default CouponForm;