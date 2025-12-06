import React, { useEffect, useState } from 'react';

const CouponCard = ({ coupon, onDelete, onEdit }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calcTime = () => {
            const now = new Date();
            const expiry = new Date(coupon.expiry);
            const diff = expiry - now;

            if (diff <= 0) return setTimeLeft('Expired');

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            setTimeLeft(`${days}d ${hrs}h ${mins}m`);
        };

        calcTime();
        const interval = setInterval(calcTime, 60000);
        return () => clearInterval(interval);
    }, [coupon.expiry]);

    return (
        <div className="coupon-card">
            <h3>{coupon.code}</h3>
            <p><b>Discount:</b> {coupon.discount} ({coupon.type})</p>
            <p><b>Min Amount:</b> ₹{coupon.minAmount}</p>
            <p><b>Usage Count:</b> {coupon.usageCount || 0}</p>
            <p><b>Expiry:</b> {new Date(coupon.expiry).toLocaleDateString()}</p>
            <p><b>Time Left:</b> {timeLeft}</p>
            <span className={`badge ${coupon.status}`}>
                {coupon.status === 'expired' ? 'Expired' : 'Usable'}
            </span>

            <div className="card-actions">
                <button className="edit-btn" onClick={onEdit}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(coupon._id)}>Delete</button>
            </div>
        </div>
    );
};

export default CouponCard;
