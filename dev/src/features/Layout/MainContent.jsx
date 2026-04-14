import './MainContent.css';

/**
 * MainContent component - Main content area wrapper
 * Provides the primary container for app content
 * Typically contains TopBar and feature-specific content
 *
 * @param {React.ReactNode} children - Content to render
 */
export function MainContent({ children }) {
  return (
    <main className="main-content">
      {children}
    </main>
  );
}
