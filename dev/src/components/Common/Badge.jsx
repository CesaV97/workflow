import './Badge.css';

/**
 * Badge component - Inline label for status, tags, etc.
 *
 * @param {string} color - Color variant (success, warning, danger, info)
 * @param {React.ReactNode} children - Badge content
 */
export function Badge({ color = 'info', children }) {
  return (
    <span className={`badge${color ? ` badge-${color}` : ''}`}>
      {children}
    </span>
  );
}
