import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Your Apple ID or password was incorrect.');
        }
    };

    return (
        <div className="auth-page fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Sign In.</h1>
                    <p className="auth-subtitle">Sign in to access your account.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <div className="auth-demo-info" style={{ backgroundColor: '#f5f5f7', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', color: '#1d1d1f' }}>
                    <strong>Demo Account:</strong><br />
                    Email: <em>hello@example.com</em><br />
                    Password: <em>hello123</em>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <input
                            type="email"
                            className={`auth-input ${error ? 'has-error' : ''}`}
                            placeholder="Email or Phone Number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`auth-input ${error ? 'has-error' : ''}`}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button type="submit" className="btn-auth">Sign In</button>
                </form>

                <div className="auth-footer">
                    <div className="mb-4">
                        <Link to="/forgot-password" className="auth-link">Forgotten your password?</Link>
                    </div>
                    <p>Don't have an Apple ID? <Link to="/signup" className="auth-link">Create yours now.</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
