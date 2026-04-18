import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getBalance } from '../api/api';

function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await getBalance();
      setWallet(response.data);
    } catch (err) {
      console.error('Error fetching balance');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoWrapper}>
          <svg width="30" height="30" viewBox="0 0 38 38" fill="none">
            <rect width="38" height="38" rx="12" fill="rgba(255,255,255,0.25)"/>
            <rect x="7" y="13" width="24" height="15" rx="3" fill="white" opacity="0.95"/>
            <path d="M7 17C7 15.3 8.3 14 10 14H28C29.7 14 31 15.3 31 17V18H7V17Z" fill="white" opacity="0.6"/>
            <rect x="22" y="18.5" width="7" height="5" rx="2.5" fill="rgba(219,112,147,0.8)"/>
            <circle cx="25.5" cy="21" r="1.2" fill="white"/>
          </svg>
          <span style={styles.logoText}>Easy-Pay</span>
        </div>

        <div style={styles.userSection}>
          <div style={styles.avatar}>{getInitials(fullName)}</div>
          <span style={styles.userName}>Hi, {fullName}!</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>

        {/* Balance Card */}
        <div style={styles.balanceCard}>
          <div style={styles.balanceCardInner}>
            <div style={styles.balanceTop}>
              <div>
                <p style={styles.balanceLabel}>Total Balance</p>
                {loading ? (
                  <p style={styles.balanceAmount}>Loading...</p>
                ) : (
                  <p style={styles.balanceAmount}>
                    ₹ {wallet?.balance?.toFixed(2) || '0.00'}
                  </p>
                )}
              </div>
              <div style={styles.balanceIcon}>💳</div>
            </div>
            <p style={styles.emailText}>{email}</p>
          </div>
          <div style={styles.circle1}/>
          <div style={styles.circle2}/>
        </div>

        {/* Quick Actions */}
        <p style={styles.sectionLabel}>Quick Actions</p>

        <div style={styles.menuGrid}>
          <Link to="/topup" style={{ ...styles.menuCard, background: 'linear-gradient(135deg, #d4f7dc, #a8edb6)' }}>
            <div style={styles.menuIconBox}>
              <span style={styles.menuEmoji}>💰</span>
            </div>
            <p style={styles.menuLabel}>Top Up</p>
            <p style={styles.menuSub}>Add money</p>
          </Link>

          <Link to="/transfer" style={{ ...styles.menuCard, background: 'linear-gradient(135deg, #ddd6fe, #c4b5fd)' }}>
            <div style={styles.menuIconBox}>
              <span style={styles.menuEmoji}>💸</span>
            </div>
            <p style={styles.menuLabel}>Transfer</p>
            <p style={styles.menuSub}>Send money</p>
          </Link>

          <Link to="/payment" style={{ ...styles.menuCard, background: 'linear-gradient(135deg, #fef08a, #fde047)' }}>
            <div style={styles.menuIconBox}>
              <span style={styles.menuEmoji}>🛒</span>
            </div>
            <p style={styles.menuLabel}>Pay</p>
            <p style={styles.menuSub}>Make payment</p>
          </Link>

          <Link to="/transactions" style={{ ...styles.menuCard, background: 'linear-gradient(135deg, #bae6fd, #7dd3fc)' }}>
            <div style={styles.menuIconBox}>
              <span style={styles.menuEmoji}>📋</span>
            </div>
            <p style={styles.menuLabel}>History</p>
            <p style={styles.menuSub}>View all</p>
          </Link>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #fff0f5 0%, #ffe4ef 100%)',
  },
  header: {
    background: 'linear-gradient(135deg, #e75480 0%, #c2185b 100%)',
    padding: '14px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(231,84,128,0.3)',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '0.5px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.3)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  userName: {
    color: 'white',
    fontSize: '15px',
    fontWeight: '500',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.5)',
    padding: '7px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px',
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #e75480 0%, #c2185b 100%)',
    borderRadius: '20px',
    padding: '28px',
    marginBottom: '28px',
    boxShadow: '0 8px 32px rgba(231,84,128,0.35)',
    position: 'relative',
    overflow: 'hidden',
  },
  balanceCardInner: {
    position: 'relative',
    zIndex: 2,
  },
  balanceTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '14px',
    margin: '0 0 6px',
  },
  balanceAmount: {
    color: 'white',
    fontSize: '42px',
    fontWeight: 'bold',
    margin: 0,
    lineHeight: 1,
  },
  balanceIcon: {
    fontSize: '40px',
    opacity: 0.85,
  },
  emailText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    margin: 0,
  },
  circle1: {
    position: 'absolute',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    top: '-60px',
    right: '-40px',
    zIndex: 1,
  },
  circle2: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    bottom: '-40px',
    left: '30px',
    zIndex: 1,
  },
  sectionLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#c2185b',
    marginBottom: '14px',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  menuCard: {
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  menuIconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  menuEmoji: {
    fontSize: '26px',
  },
  menuLabel: {
    color: '#222',
    fontWeight: '700',
    fontSize: '15px',
    margin: '0 0 4px',
  },
  menuSub: {
    color: '#666',
    fontSize: '12px',
    margin: 0,
  },
};

export default Dashboard;