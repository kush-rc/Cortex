import React from 'react';

const Logo = ({ className = '', width = "22", height = "22", style = {} }) => (
    <div className={`cortex-logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', ...style }}>
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18.5C9.42 18.5 7.18 17.01 6 14.83C6.72 15.09 7.53 15.25 8.38 15.25C11.97 15.25 14.88 12.34 14.88 8.75C14.88 7.62 14.59 6.59 14.12 5.71C16.89 6.54 18.88 9.06 18.88 12C18.88 15.59 15.79 18.5 12 18.5Z" />
        </svg>
        <span style={{ fontSize: '20px', fontWeight: '500', letterSpacing: '-0.3px', color: 'currentColor' }}>Cortex</span>
    </div>
)

export default Logo;
