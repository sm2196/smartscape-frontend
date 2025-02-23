const Button = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles =
    "inline-flex items-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    default: "",
    ghost: "",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button

