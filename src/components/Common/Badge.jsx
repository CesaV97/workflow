/**
 * Badge component - Display a labeled badge with color variants
 *
 * @param {string} color - Badge color variant: 'info', 'warning', 'success', 'danger'
 * @param {string} children - Badge text content
 * @param {string} className - Additional CSS classes
 */
export function Badge({ color = 'info', children, className = '' }) {
  return (
    <span className={`badge badge-${color} ${className}`}>
      {children}
    </span>
  );
}
