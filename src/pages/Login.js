import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('fullName', response.data.fullName);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrapper}>
          <div style={styles.logoIcon}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <rect width="38" height="38" rx="12" fill="url(#grad)"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#667eea"/>
                  <stop offset="100%" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
              {/* Wallet body */}
              <rect x="7" y="13" width="24" height="15" rx="3" fill="white" opacity="0.95"/>
              {/* Wallet flap */}
              <path d="M7 17C7 15.3 8.3 14 10 14H28C29.7 14 31 15.3 31 17V18H7V17Z" fill="white" opacity="0.6"/>
              {/* Coin slot */}
              <rect x="22" y="18.5" width="7" height="5" rx="2.5" fill="url(#grad2)"/>
              <circle cx="25.5" cy="21" r="1.2" fill="white"/>
              <defs>
                <linearGradient id="grad2" x1="22" y1="18.5" x2="29" y2="23.5" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#667eea"/>
                  <stop offset="100%" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 style={styles.logoTitle}>Easy-Pay</h1>
            <p style={styles.logoTagline}>Smart. Fast. Secure.</p>
          </div>
        </div>

        <h2 style={styles.subtitle}>Login to your account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.linkText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    width: '400px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    justifyContent: 'center',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1.1,
  },
  logoTagline: {
    margin: 0,
    fontSize: '11px',
    color: '#aaa',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  subtitle: {
    textAlign: 'center',
    color: '#444',
    marginBottom: '24px',
    fontSize: '16px',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#555',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '12px',
    fontSize: '14px',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#555',
    fontSize: '14px',
  },
  link: {
    color: '#667eea',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};

export default Login;