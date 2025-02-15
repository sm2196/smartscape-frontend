import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-lg border bg-white text-gray-800 shadow-md ${className}`} // Using custom styles
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;