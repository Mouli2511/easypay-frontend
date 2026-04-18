import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, createWallet } from '../api/api';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await registerUser(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('fullName', response.data.fullName);
      await createWallet();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>E-Wallet</h1>
        <h2 style={styles.subtitle}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              style={styles.input}
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p style={styles.linkText}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
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
    borderRadius: '16px',
    width: '400px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: {
    textAlign: 'center',
    color: '#667eea',
    marginBottom: '8px',
    fontSize: '32px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '24px',
    fontSize: '20px',
  },
  inputGroup: { marginBottom: '16px' },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: { color: 'red', textAlign: 'center', marginBottom: '12px' },
  linkText: { textAlign: 'center', marginTop: '16px', color: '#555' },
  link: { color: '#667eea', fontWeight: 'bold' },
};

export default Register;