import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { topUpWallet } from '../api/api';

function TopUp() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTopUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await topUpWallet({ amount: parseFloat(amount), description });
      setMessage(`Top-up successful! New balance: ₹${response.data.balance}`);
      setAmount('');
      setDescription('');
    } catch (err) {
      setError('Top-up failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
        <div style={styles.headerCenter}>
          <span style={styles.headerIcon}>💰</span>
          <h2 style={styles.headerTitle}>Top Up</h2>
        </div>
        <div style={{ width: '70px' }} />
      </div>

      <div style={styles.content}>
        <div style={styles.card}>

          {/* Banner */}
          <div style={styles.banner}>
            <div style={styles.bannerIcon}>💰</div>
            <div>
              <p style={styles.bannerTitle}>Add Money to Wallet</p>
              <p style={styles.bannerSub}>Instant. Secure. Easy.</p>
            </div>
          </div>

          {message && (
            <div style={styles.successBox}>
              ✅ {message}
            </div>
          )}
          {error && (
            <div style={styles.errorBox}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleTopUp}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount (₹)</label>
              <input
                style={styles.input}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description (optional)</label>
              <input
                style={styles.input}
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Salary, Savings"
              />
            </div>

            <p style={styles.quickLabel}>Quick Select</p>
            <div style={styles.quickAmounts}>
              {[100, 500, 1000, 5000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  style={{
                    ...styles.quickBtn,
                    ...(amount === amt.toString() ? styles.quickBtnActive : {})
                  }}
                  onClick={() => setAmount(amt.toString())}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Top Up Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 100%)',
  },
  header: {
    background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 16px rgba(74,222,128,0.3)',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.5)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  headerCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerIcon: { fontSize: '20px' },
  headerTitle: {
    color: 'white',
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
  },
  content: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(74,222,128,0.15)',
  },
  banner: {
    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    borderRadius: '14px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  bannerIcon: { fontSize: '36px' },
  bannerTitle: {
    margin: '0 0 4px',
    fontWeight: '700',
    color: '#16a34a',
    fontSize: '16px',
  },
  bannerSub: {
    margin: 0,
    color: '#4ade80',
    fontSize: '12px',
  },
  successBox: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#15803d',
    fontWeight: '600',
    marginBottom: '16px',
    fontSize: '14px',
  },
  errorBox: {
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#be123c',
    fontWeight: '600',
    marginBottom: '16px',
    fontSize: '14px',
  },
  inputGroup: { marginBottom: '16px' },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#555',
    fontWeight: '700',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1.5px solid #bbf7d0',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    background: '#f9fefb',
  },
  quickLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: '10px',
  },
  quickAmounts: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
  },
  quickBtn: {
    padding: '9px 18px',
    border: '2px solid #bbf7d0',
    borderRadius: '10px',
    background: 'white',
    color: '#16a34a',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
  },
  quickBtnActive: {
    background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
    color: 'white',
    border: '2px solid transparent',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(74,222,128,0.35)',
  },
};

export default TopUp;