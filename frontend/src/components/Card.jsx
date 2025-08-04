import React from 'react';

const Card = ({ children, className = '', style = {}, ...props }) => (
  <div
    className={`admin-card ${className}`}
    style={{ borderRadius: 16, background: '#fff', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.08)', padding: '2rem 1.5rem', ...style }}
    {...props}
  >
    {children}
  </div>
);

export default Card;
