import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions } from '../api/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    if (!type) return '💳';
    switch (type.toUpperCase()) {
      case 'CREDIT': return '⬇️';
      case 'DEBIT': return '⬆️';
      case 'TOPUP': return '💰';
      case 'TRANSFER': return '💸';
      default: return '💳';
    }
  };

  const isCredit = (txn) => {
    if (!txn.type) return false;
    const t = txn.type.toUpperCase();
    if (t === 'CREDIT' || t === 'TOPUP') return true;
    if (t === 'TRANSFER' && txn.receiverEmail === email) return true;
    return false;
  };

  const filtered = filter === 'ALL'
    ? transactions
    : transactions.filter(t => t.type?.toUpperCase() === filter);

  const totalCredit = transactions
    .filter(t => isCredit(t))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalDebit = transactions
    .filter(t => !isCredit(t))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
        <div style={styles.headerCenter}>
          <span style={styles.headerIcon}>📋</span>
          <h2 style={styles.headerTitle}>Transaction History</h2>
        </div>
        <div style={{ width: '70px' }} />
      </div>

      <div style={styles.content}>

        {/* Summary Cards */}
        <div style={styles.summaryRow}>
          <div style={{ ...styles.summaryCard, borderLeft: '4px solid #22c55e' }}>
            <p style={styles.summaryLabel}>Total In</p>
            <p style={{ ...styles.summaryAmount, color: '#22c55e' }}>₹{totalCredit.toFixed(2)}</p>
          </div>
          <div style={{ ...styles.summaryCard, borderLeft: '4px solid #ef4444' }}>
            <p style={styles.summaryLabel}>Total Out</p>
            <p style={{ ...styles.summaryAmount, color: '#ef4444' }}>₹{totalDebit.toFixed(2)}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterRow}>
          {['ALL', 'TOPUP', 'TRANSFER', 'DEBIT', 'CREDIT'].map(f => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.activeFilter : {}) }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {loading ? (
          <div style={styles.emptyState}>Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p style={{ color: '#999' }}>No transactions found.</p>
          </div>
        ) : (
          filtered.map((txn, i) => {
            const credit = isCredit(txn);
            return (
              <div key={i} style={styles.txnCard}>
                <div style={styles.txnLeft}>
                  <div style={{
                    ...styles.txnIconBox,
                    background: credit ? '#dcfce7' : '#fee2e2',
                  }}>
                    {getTypeIcon(txn.type)}
                  </div>
                  <div>
                    <p style={styles.txnDesc}>{txn.description || txn.type || 'Transaction'}</p>
                    <p style={styles.txnMeta}>
                      {txn.senderEmail && txn.senderEmail !== email
                        ? `From: ${txn.senderEmail}`
                        : txn.receiverEmail
                        ? `To: ${txn.receiverEmail}`
                        : txn.type}
                    </p>
                    <p style={styles.txnDate}>
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleString() : '—'}
                    </p>
                  </div>
                </div>
                <div style={styles.txnRight}>
                  <p style={{
                    ...styles.txnAmount,
                    color: credit ? '#22c55e' : '#ef4444',
                  }}>
                    {credit ? '+' : '-'}₹{txn.amount?.toFixed(2)}
                  </p>
                  {txn.type && (
                    <span style={{
                      ...styles.typeBadge,
                      background: credit ? '#22c55e' : '#ef4444',
                    }}>
                      {txn.type}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f0f9ff 0%, #bae6fd 100%)',
  },
  header: {
    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 16px rgba(2,132,199,0.3)',
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
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px',
  },
  summaryRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
  },
  summaryCard: {
    flex: 1,
    background: 'white',
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(2,132,199,0.1)',
  },
  summaryLabel: { margin: '0 0 4px', color: '#888', fontSize: '13px' },
  summaryAmount: { margin: 0, fontSize: '22px', fontWeight: 'bold' },
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1.5px solid #bae6fd',
    background: 'white',
    color: '#0284c7',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  activeFilter: {
    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
    color: 'white',
    border: '1.5px solid transparent',
  },
  txnCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '14px 18px',
    marginBottom: '10px',
    boxShadow: '0 2px 8px rgba(2,132,199,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txnLeft: { display: 'flex', gap: '12px', alignItems: 'center' },
  txnIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  txnDesc: { margin: 0, fontWeight: 'bold', color: '#333', fontSize: '14px' },
  txnMeta: { margin: '2px 0 0', color: '#888', fontSize: '12px' },
  txnDate: { margin: '2px 0 0', color: '#bbb', fontSize: '11px' },
  txnRight: { textAlign: 'right' },
  txnAmount: { margin: '0 0 4px', fontWeight: 'bold', fontSize: '16px' },
  typeBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(2,132,199,0.08)',
  },
};

export default Transactions;