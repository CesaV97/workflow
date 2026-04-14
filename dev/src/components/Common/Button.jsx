import './Button.css';

/**
 * Button component - Reusable button element
 *
 * @param {string} variant - Button style variant (primary, secondary, danger, success)
 * @param {boolean} disabled - Disabled state
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} children - Button content
 * @param {object} rest - Additional HTML attributes
 */
export function Button({
  variant = 'primary',
  disabled = false,
  onClick,
  children,
  ...rest
}) {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
