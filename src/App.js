import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TopUp from './pages/TopUp';
import Transfer from './pages/Transfer';
import Payment from './pages/Payment';
import Transactions from './pages/Transactions';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/topup" element={<PrivateRoute><TopUp /></PrivateRoute>} />
        <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;