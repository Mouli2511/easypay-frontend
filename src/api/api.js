import axios from 'axios';

const USER_SERVICE = 'http://localhost:8081';
const WALLET_SERVICE = 'http://localhost:8082';
const PAYMENT_SERVICE = 'http://localhost:8083';
const NOTIFICATION_SERVICE = 'http://localhost:8084';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Auth APIs
export const registerUser = (data) =>
  axios.post(`${USER_SERVICE}/api/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${USER_SERVICE}/api/auth/login`, data);

// Wallet APIs
export const createWallet = () =>
  axios.post(`${WALLET_SERVICE}/api/wallet/create`, {}, { headers: getAuthHeader() });

export const getBalance = () =>
  axios.get(`${WALLET_SERVICE}/api/wallet/balance`, { headers: getAuthHeader() });

export const topUpWallet = (data) =>
  axios.post(`${WALLET_SERVICE}/api/wallet/topup`, data, { headers: getAuthHeader() });

export const transferMoney = (data) =>
  axios.post(`${WALLET_SERVICE}/api/wallet/transfer`, data, { headers: getAuthHeader() });

export const getTransactions = () =>
  axios.get(`${WALLET_SERVICE}/api/wallet/transactions`, { headers: getAuthHeader() });

// Payment APIs
export const processPayment = (data) =>
  axios.post(`${PAYMENT_SERVICE}/api/payment/process`, data, { headers: getAuthHeader() });

export const getPaymentHistory = () =>
  axios.get(`${PAYMENT_SERVICE}/api/payment/history`, { headers: getAuthHeader() });

// Notification APIs
export const getNotifications = (email) =>
  axios.get(`${NOTIFICATION_SERVICE}/api/notification/user/${email}`, { headers: getAuthHeader() });