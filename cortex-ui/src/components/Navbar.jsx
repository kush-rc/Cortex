import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import Logo from './Logo'
import './Navbar.css'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const { openChat } = useChat()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        setMenuOpen(false)
        navigate('/')
    }

    // Real Apple categories
    const navItems = [
        { label: 'Store', path: '/store' },
        { label: 'Mac', path: '/mac' },
        { label: 'iPad', path: '/ipad' },
        { label: 'iPhone', path: '/iphone' },
        { label: 'Watch', path: '/watch' },
        { label: 'AirPods', path: '/airpods' },
        { label: 'TV & Home', path: '/tv-home' },
        { label: 'Entertainment', path: '/entertainment' },
        { label: 'Accessories', path: '/accessories' },
        { label: 'Support', path: '/support' },
    ]

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
                    <Logo className="nav-apple-logo" width="22" height="22" />
                </Link>

                <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link to={item.path} onClick={() => setMenuOpen(false)}>{item.label}</Link>
                        </li>
                    ))}
                    {/* Mobile Auth Links */}
                    <div className="mobile-auth">
                        {user ? (
                            <>
                                <li className="nav-user-mobile">Hi, {user.username}</li>
                                <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
                                <li><button onClick={handleLogout} className="nav-link-btn">Log out</button></li>
                            </>
                        ) : (
                            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Log in</Link></li>
                        )}
                    </div>
                </ul>

                <div className="nav-actions">
                    <div className="nav-icons-group">
                        {/* Chat Icon Button */}
                        <button className="nav-icon chat-btn" onClick={() => openChat()} aria-label="Ask Gizmo">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>

                        <div className="desktop-auth">
                            {user ? (
                                <Link to="/profile" className="user-menu-link">
                                    <div className="nav-avatar">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="nav-link-small">Log in</Link>
                            )}
                        </div>

                        <Link to="/bag" className="nav-icon cart-icon" onClick={() => setMenuOpen(false)}>
                            {/* Apple-style Bag Icon */}
                            <svg width="18" height="18" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 12V8a8 8 0 0 1 16 0v4" strokeLinecap="round" />
                                <path d="M10 12H34L36 38H8L10 12Z" strokeLinejoin="round" />
                                <circle cx="22" cy="19" r="1.5" fill="currentColor" opacity="0.4" />
                            </svg>
                        </Link>
                    </div>
                    <button
                        className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
