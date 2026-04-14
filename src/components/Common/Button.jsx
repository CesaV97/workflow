/**
 * Button component - Reusable button with variants
 *
 * @param {string} variant - Button style variant: 'primary', 'secondary', 'danger'
 * @param {function} onClick - Click handler
 * @param {string} children - Button text
 * @param {boolean} disabled - Disabled state
 * @param {string} type - HTML button type (button, submit, reset)
 * @param {string} className - Additional CSS classes
 */
export function Button({
  variant = 'primary',
  onClick,
  children,
  disabled = false,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
    </button>
  );
}
