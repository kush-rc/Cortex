import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setError(data.error || 'Something went wrong.');
            }
        } catch (err) {
            setError('Failed to connect to server.');
        }
    };

    return (
        <div className="auth-page fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Reset Password.</h1>
                    <p className="auth-subtitle">Enter your email to reset your password.</p>
                </div>

                {message && (
                    <div className="auth-success" style={{ color: '#34c759', marginBottom: '16px', fontSize: '14px' }}>
                        <span>✅</span> {message}
                    </div>
                )}

                {error && (
                    <div className="auth-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth">Continue</button>
                </form>

                <div className="auth-footer">
                    <p>Remembered your password? <Link to="/login" className="auth-link">Sign In.</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
