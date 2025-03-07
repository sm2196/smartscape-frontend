import React from 'react';

const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-700', // Custom styles
    outline: 'border border-blue-500 hover:bg-blue-500 hover:text-white',
    secondary: 'bg-green-500 text-white hover:bg-green-700',
    ghost: 'hover:bg-gray-200 hover:text-gray-800',
  };

  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} // Updated for custom styles
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;