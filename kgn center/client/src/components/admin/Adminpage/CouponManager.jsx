import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CouponCard from './CouponCard';
import EditCouponModal from './EditCouponModal';
import '../Admincss/CouponManager.css';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6;

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState('');
  const [minDiscount, setMinDiscount] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [expiry, setExpiry] = useState('');
  const [sort, setSort] = useState('');
  const [editCoupon, setEditCoupon] = useState(null);
  const [page, setPage] = useState(1);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/api/coupons/all');
      const updatedCoupons = res.data.map(coupon => ({
        ...coupon,
        isExpired: new Date(coupon.expiry) < new Date(),
      }));
      setCoupons(updatedCoupons);
    } catch (err) {
      toast.error('Failed to load coupons');
    }
  };

  useEffect(() => {
    fetchCoupons();
    const interval = setInterval(fetchCoupons, 5 * 60 * 1000); // refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      await axios.put(`/api/coupons/${updatedData._id}`, updatedData);
      toast.success('Coupon updated!');
      setEditCoupon(null);
      fetchCoupons();
    } catch {
      toast.error('Failed to update');
    }
  };

  const filteredCoupons = coupons
    .filter(c => c.code.toLowerCase().includes(search.toLowerCase()))
    .filter(c => !minDiscount || c.discount >= Number(minDiscount))
    .filter(c => !maxDiscount || c.discount <= Number(maxDiscount))
    .filter(c => !expiry || new Date(c.expiry) <= new Date(expiry))
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'highest') return b.discount - a.discount;
      if (sort === 'lowest') return a.discount - b.discount;
      return 0;
    });

  const paginated = filteredCoupons.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE);

  return (
    <div className="coupon-manager-container">
      <h2>Manage Coupons</h2>

      <div className="filters">
        <input type="text" placeholder="Search code" value={search} onChange={e => setSearch(e.target.value)} />
        <input type="number" placeholder="Min %" value={minDiscount} onChange={e => setMinDiscount(e.target.value)} />
        <input type="number" placeholder="Max %" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} />
        <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Discount</option>
          <option value="lowest">Lowest Discount</option>
        </select>
      </div>

      <div className="coupon-grid">
        {paginated.map(coupon => (
          <CouponCard
            key={coupon._id}
            coupon={coupon}
            onDelete={handleDelete}
            onEdit={() => {
              if (!coupon.isExpired) {
                setEditCoupon(coupon);
              } else {
                toast.warn('Cannot edit expired coupon');
              }
            }}
          />
        ))}
      </div>

      {editCoupon && (
        <EditCouponModal coupon={editCoupon} onClose={() => setEditCoupon(null)} onSubmit={handleEditSubmit} />
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CouponManager;
