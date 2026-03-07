import React, { useState, useEffect, useRef } from 'react';
import './SearchableSelect.css';

const SearchableSelect = ({ options, value, onChange, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    // Sync search term with value when closed
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm(value || '');
        }
    }, [value, isOpen]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options based on search
    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If search is empty, show top 4. Otherwise show all matching.
    const displayOptions = searchTerm === '' ? filteredOptions.slice(0, 4) : filteredOptions;

    return (
        <div className={`searchable-select-container ${disabled ? 'disabled' : ''}`} ref={containerRef}>
            <div className="search-input-wrapper">
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                        // If they clear it, also clear the actual value
                        if (e.target.value === '') {
                            onChange('');
                        }
                    }}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                />
                <svg className="chevron-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>

            {isOpen && !disabled && (
                <ul className="options-list fade-in-fast">
                    {displayOptions.length > 0 ? (
                        displayOptions.map((opt) => (
                            <li
                                key={opt}
                                className={`option-item ${opt === value ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(opt);
                                    setSearchTerm(opt);
                                    setIsOpen(false);
                                }}
                            >
                                {opt}
                            </li>
                        ))
                    ) : (
                        <li className="option-item no-results">No matches found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;
