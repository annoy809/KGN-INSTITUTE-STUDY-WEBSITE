import React from "react";

const StateCard = ({ icon, title, value, type, hasNotification, onClick }) => {
  // Card accent colors (student roles only)
  let cardColorClass = "";
  switch (type) {
    case "enrolled":
      cardColorClass = "card-blue";
      break;
    case "active":
      cardColorClass = "card-purple";
      break;
    case "completed":
      cardColorClass = "card-green";
      break;
    case "meetings":
      cardColorClass = "card-cyan";
      break;
    default:
      cardColorClass = "card-default";
  }

  return (
    <>
      <style>{`
        /* ============================================================
         💠 StateCard — Clean Student Dashboard Card (2025 Edition)
        ============================================================ */

        .state-card {
          background: var(--card-bg, #fff);
          border-radius: var(--card-border-radius, 16px);
          box-shadow: var(--card-shadow, 0 4px 12px rgba(0,0,0,0.08));
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          min-height: 130px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: ${onClick ? "pointer" : "default"};
        }

        /* Subtle glowing gradient overlay */
        .state-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, var(--primary-blue, #3b82f6), var(--info-cyan, #06b6d4));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .state-card:hover::before {
          opacity: 0.12;
        }

        .state-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.12);
        }

        .state-card * {
          position: relative;
          z-index: 1;
        }

        /* Icon */
        .state-card .icon {
          font-size: 2.4rem;
          margin-bottom: 14px;
          line-height: 1;
          color: var(--dashboard-text-dark, #1e293b);
          opacity: 0.9;
        }

        /* Title */
        .state-card .title {
          font-size: 1.05rem;
          color: var(--dashboard-text-light, #64748b);
          font-weight: 500;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Value */
        .state-card .value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--dashboard-text-dark, #1e293b);
          line-height: 1.1;
          letter-spacing: 0.3px;
        }

        /* ---------- 🎨 Color Variants ---------- */
        .card-blue   { border-left: 6px solid var(--primary-blue, #3b82f6); }
        .card-purple { border-left: 6px solid var(--purple, #8b5cf6); }
        .card-green  { border-left: 6px solid var(--success-green, #22c55e); }
        .card-cyan   { border-left: 6px solid var(--info-cyan, #06b6d4); }
        .card-default { border-left: 6px solid var(--dashboard-border-color, #cbd5e1); }

        /* ---------- 🔴 Notification Dot ---------- */
        .red-dot {
          width: 10px;
          height: 10px;
          background-color: #ef4444;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 6px rgba(239, 68, 68, 0.7);
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ---------- 📱 Responsive ---------- */
        @media (max-width: 768px) {
          .state-card {
            padding: 20px;
            min-height: 110px;
          }
          .icon { font-size: 2rem; margin-bottom: 10px; }
          .title { font-size: 1rem; }
          .value { font-size: 1.7rem; }
        }

        @media (max-width: 480px) {
          .state-card {
            padding: 16px;
            min-height: 90px;
          }
          .icon { font-size: 1.8rem; margin-bottom: 8px; }
          .title { font-size: 0.9rem; }
          .value { font-size: 1.5rem; }
        }
      `}</style>

      <div
        className={`state-card ${cardColorClass}`}
        onClick={onClick}
        title={onClick ? "Click to view details" : ""}
      >
        <div className="icon">{icon}</div>
        <div className="title">
          {title}
          {hasNotification && <span className="red-dot" />}
        </div>
        <div className="value">{value}</div>
      </div>
    </>
  );
};

export default StateCard;
