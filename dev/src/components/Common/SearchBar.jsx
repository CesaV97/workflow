import { useState } from 'react';
import './SearchBar.css';

/**
 * SearchBar component - Input field for search functionality
 *
 * @param {function} onSearch - Callback when search value changes
 * @param {string} placeholder - Input placeholder text
 * @param {string} value - Controlled input value (optional for uncontrolled component)
 */
export function SearchBar({ onSearch, placeholder = 'Search...', value }) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onSearch(newValue);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        aria-label="Search"
      />
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </div>
  );
}
