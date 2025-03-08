import clsx from "clsx"; // Import clsx for conditional classnames

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={clsx(className)} // Applying dynamic classes
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
