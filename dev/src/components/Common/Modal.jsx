import './Modal.css';

/**
 * Modal component - Dialog overlay for displaying content
 *
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Modal content
 */
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
