import React from 'react'
import { Link } from 'react-router-dom'
import './MacCategoryNav.css'

const navItems = [
    { label: 'MacBook Air', icon: 'mba', path: '/mac/macbook-air' },
    { label: 'MacBook Pro', icon: 'mbp', path: '/mac/macbook-pro' },
    { label: 'iMac', icon: 'imac', path: '/mac/imac' },
    { label: 'Mac mini', icon: 'macmini', path: '/mac/mac-mini' },
    { label: 'Mac Studio', icon: 'macstudio', path: '/mac/mac-studio' },
    { label: 'Mac Pro', icon: 'macpro', path: '/mac/mac-pro' },
    { label: 'Displays', icon: 'display', path: '/mac/displays' },
    { label: 'Compare', icon: 'compare', path: '/mac/compare' },
    { label: 'Shop Mac', icon: 'shop', path: '/store/mac' },
]

const Icons = {
    mba: (
        <svg viewBox="0 0 50 50" className="mac-nav-icon">
            <path d="M5 35h40l-2-20H7z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M4 35h42v2H4z" fill="currentColor" />
        </svg>
    ), // Simplified laptop
    mbp: (
        <svg viewBox="0 0 50 50" className="mac-nav-icon">
            <rect x="7" y="10" width="36" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M4 36h42v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z" fill="currentColor" />
        </svg>
    ),
    imac: (
        <svg viewBox="0 0 50 50" className="mac-nav-icon">
            <rect x="5" y="5" width="40" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="5" y="27" width="40" height="6" fill="currentColor" opacity="0.1" />
            <path d="M20 33l-2 8h14l-2-8" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="16" y="41" width="18" height="2" fill="currentColor" />
        </svg>
    ),
    macmini: (
        <svg viewBox="0 0 50 50" className="mac-nav-icon">
            <rect x="10" y="20" width="30" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    macstudio: (
        <svg viewBox="0 0 50 50" className="mac-nav-icon">
            <rect x="12" y="15" width="26" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="18" y="32" width="14" height="1" fill="currentColor" opacity="0.3" />
        </svg>
    ),
    macpro: (
        <svg viewBox="0 0 50 50" className="mac-nav-icon">
            <rect x="15" y="5" width="20" height="35" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="20" cy="12" r="1.5" fill="currentColor" />
            <circle cx="30" cy="12" r="1.5" fill="currentColor" />
            <circle cx="25" cy="20" r="1.5" fill="currentColor" />
            <rect x="15" y="36" width="20" height="4" fill="currentColor" opacity="0.2" />
        </svg>
    ),
    display: (
        <svg viewBox="0 0 50 50" className="mac-nav-icon">
            <rect x="5" y="5" width="40" height="28" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M22 33v8h6v-8" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="18" y="41" width="14" height="2" fill="currentColor" />
        </svg>
    ),
    compare: (
        <svg viewBox="0 0 50 50" className="mac-nav-icon">
            <rect x="10" y="15" width="12" height="20" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="28" y="10" width="14" height="25" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),
    shop: (
        <svg viewBox="0 0 50 50" className="mac-nav-icon">
            <path d="M15 15h20v20H15z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M25 10l-5 5h10l-5-5z" fill="currentColor" />
        </svg>
    )
}

const MacCategoryNav = () => {
    return (
        <div className="mac-category-nav">
            <div className="mac-nav-container">
                {navItems.map(item => (
                    <Link to={item.path} key={item.label} className="mac-nav-item">
                        <div className="mac-nav-icon-wrapper">
                            {Icons[item.icon]}
                        </div>
                        <span className="mac-nav-label">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MacCategoryNav
