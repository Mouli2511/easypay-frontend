import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { processPayment, getPaymentHistory } from '../api/api';

function Payment() {
  const [tab, setTab] = useState('pay');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === 'history') fetchHistory();
  }, [tab]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getPaymentHistory();
      setHistory(res.data);
    } catch (err) {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await processPayment({
        amount: parseFloat(amount),
        description,
        receiverEmail,
      });
      setMessage(`Payment successful! Transaction ID: ${res.data.transactionId}`);
      setAmount('');
      setDescription('');
      setReceiverEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#999';
    switch (status.toUpperCase()) {
      case 'SUCCESS': return '#22c55e';
      case 'FAILED': return '#ef4444';
      case 'PENDING': return '#f59e0b';
      case 'REFUNDED': return '#8b5cf6';
      default: return '#999';
    }
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
        <div style={styles.headerCenter}>
          <span style={styles.headerIcon}>🛒</span>
          <h2 style={styles.headerTitle}>Payments</h2>
        </div>
        <div style={{ width: '70px' }} />
      </div>

      <div style={styles.content}>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === 'pay' ? styles.activeTab : {}) }}
            onClick={() => setTab('pay')}
          >
            🛒 Make Payment
          </button>
          <button
            style={{ ...styles.tab, ...(tab === 'history' ? styles.activeTab : {}) }}
            onClick={() => setTab('history')}
          >
            📄 Payment History
          </button>
        </div>

        {/* Pay Tab */}
        {tab === 'pay' && (
          <div style={styles.card}>

            <div style={styles.banner}>
              <div style={styles.bannerIcon}>🛒</div>
              <div>
                <p style={styles.bannerTitle}>Make a Payment</p>
                <p style={styles.bannerSub}>Pay any Easy-Pay user instantly.</p>
              </div>
            </div>

            {message && <div style={styles.successBox}>✅ {message}</div>}
            {error && <div style={styles.errorBox}>❌ {error}</div>}

            <form onSubmit={handlePayment}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Pay To (Email)</label>
                <input
                  style={styles.input}
                  type="email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  placeholder="Enter merchant/receiver email"
                  required
                />
              </div>
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
                  placeholder="e.g. Shopping, Bill, Subscription"
                />
              </div>

              <p style={styles.quickLabel}>Quick Select</p>
              <div style={styles.quickAmounts}>
                {[199, 499, 999, 1999].map(amt => (
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
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          </div>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <div>
            {historyLoading ? (
              <div style={styles.emptyState}>Loading payment history...</div>
            ) : history.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                <p style={{ color: '#999' }}>No payment history yet.</p>
              </div>
            ) : (
              history.map((p, i) => (
                <div key={i} style={styles.historyCard}>
                  <div style={styles.historyLeft}>
                    <div style={styles.historyIconBox}>🛒</div>
                    <div>
                      <p style={styles.historyDesc}>{p.description || 'Payment'}</p>
                      <p style={styles.historyTo}>To: {p.receiverEmail || '—'}</p>
                      <p style={styles.historyDate}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleString() : '—'}
                      </p>
                    </div>
                  </div>
                  <div style={styles.historyRight}>
                    <p style={styles.historyAmount}>- ₹{p.amount?.toFixed(2)}</p>
                    <span style={{ ...styles.statusBadge, background: getStatusColor(p.status) }}>
                      {p.status || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #fdf6ec 0%, #f5e6d0 100%)',
  },
  header: {
    background: 'linear-gradient(135deg, #c8a165 0%, #a0784a 100%)',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 16px rgba(160,120,74,0.3)',
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
    maxWidth: '560px',
    margin: '0 auto',
    padding: '24px',
  },
  tabs: {
    display: 'flex',
    background: 'white',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(160,120,74,0.1)',
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#888',
  },
  activeTab: {
    background: 'linear-gradient(135deg, #c8a165 0%, #a0784a 100%)',
    color: 'white',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(160,120,74,0.12)',
  },
  banner: {
    background: 'linear-gradient(135deg, #fdf0dc 0%, #f5ddb0 100%)',
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
    color: '#a0784a',
    fontSize: '16px',
  },
  bannerSub: {
    margin: 0,
    color: '#c8a165',
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
    border: '1.5px solid #e8d5b7',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    background: '#fffaf4',
  },
  quickLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#a0784a',
    marginBottom: '10px',
  },
  quickAmounts: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
  },
  quickBtn: {
    padding: '9px 16px',
    border: '2px solid #e8d5b7',
    borderRadius: '10px',
    background: 'white',
    color: '#a0784a',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
  },
  quickBtnActive: {
    background: 'linear-gradient(135deg, #c8a165 0%, #a0784a 100%)',
    color: 'white',
    border: '2px solid transparent',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #c8a165 0%, #a0784a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(160,120,74,0.35)',
  },
  historyCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(160,120,74,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: { display: 'flex', gap: '12px', alignItems: 'center' },
  historyIconBox: { fontSize: '28px' },
  historyDesc: { margin: 0, fontWeight: 'bold', color: '#333', fontSize: '15px' },
  historyTo: { margin: '2px 0 0', color: '#888', fontSize: '13px' },
  historyDate: { margin: '2px 0 0', color: '#aaa', fontSize: '12px' },
  historyRight: { textAlign: 'right' },
  historyAmount: { margin: '0 0 6px', fontWeight: 'bold', color: '#ef4444', fontSize: '16px' },
  statusBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(160,120,74,0.1)',
  },
};

export default Payment;