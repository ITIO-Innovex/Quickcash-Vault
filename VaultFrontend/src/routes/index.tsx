import Demo from '@/pages/User/demo';
import KYC from '@/pages/User/KYC/main';
import Cards from '@/pages/User/cards/card';
import { RootLayout } from '@/layouts/index';
import Wallet from '@/pages/User/Wallet/main';
import Tokens from '@/pages/User/Tokens/main'; 
import FeeDetail from '@/pages/Admin/Fee/main';
import Spot from '@/pages/User/SpotTrade/main';
import Tickets from '@/pages/User/Tickets/main';
import Home from '@/pages/LandingPage/HomePage';
import AdminLayout from '@/layouts/adminLayout';
import Ticket from '@/pages/Admin/Tickets/main';
import Clients from '@/pages/User/Clients/main';
import Invoice from '@/pages/Admin/Invoice/main';
import Revenue from '@/pages/Admin/Revenue/main';
import Contact from '@/pages/LandingPage/Contact';
import Currency from '@/pages/User/Currency/main'; 
import UserDashboard from '@/pages/User/Dashboard';
import UserList from '@/pages/Admin/UserList/main';
import UserLogin from '@/pages/User/Auth/UserLogin';
import NotFound from '@/pages/LandingPage/NotFound';
import UserProfile from '@/pages/User/Profile/main';
import MinimalLayout from '@/layouts/minimalLayout';
import Statements from '@/pages/User/Statement/main';
import UserKyc from '@/pages/Admin/KYC/UserKyc/main';
import KycMode from '@/pages/Admin/KYC/KycMode/main';
import Blockchain from '@/pages/User/Blockchain/main';
import AdminProfile from '@/pages/Admin/Profile/main';
import UserSignup from '@/pages/User/Auth/UserSignup';
import SubAdmin from '@/pages/Admin/Subadmin/main.js';
import ReferEarn from '@/pages/User/ReferEarn/Main.js';
import AddClient from '@/pages/User/Clients/AddClient';
import AdminLogin from '@/pages/Admin/Auth/AdminLogin';
import BuySellSwap from '@/pages/User/BuySellSwap/main';
import Transactions from '@/pages/User/Transaction/main';
import Dashboard from '@/pages/Admin/Dashboard/Dashboard';
import CurrencyList from '@/pages/Admin/CurrencyList/main';
import CoinList from '@/pages/Admin/Crypto/CoinsList/main';
import Notification from '@/pages/Admin/Notification/main';
import SummaryTokens from '@/pages/User/SummaryTokens/main'; 
import ExchangePairs from '@/pages/User/ExchangePairs/main'; 
import InstrumentPairs from '@/pages/User/Instruments/main'; 
import CryptoDashboard from '@/pages/User/Crypto/Dashboard';
import ForgotPasswordPage from '@/pages/User/ForgotPassord';
import BusinessKyc from '@/pages/Admin/KYC/BusinessKyc/main';
import WalletAccounts from '@/pages/User/WalletAccount/main';
import PrivacyPolicy from '@/pages/LandingPage/PrivacyPolicy';
import AdminDashboard from '@/pages/Admin/Dashboard/Dashboard';
import ProceedPage from '@/pages/User/BuySellSwap/ProceedPage';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import TransferReuest from '@/pages/Admin/Crypto/Transfers/main';
import BusinessRegister from '@/pages/User/BusinessRegister/main';
import AllSubscriptions from '@/pages/User/Subscriptions/Plans/main'; 
import WalletRequest from '@/pages/Admin/Crypto/WalletRequests/main';
import MySubscriptions from '@/pages/User/Subscriptions/MyPlanss/main';
import InvoiceDashboard from '@/pages/User/InvoiceDashboard/Dashboard';
import CardRequests from '@/pages/User/cards/card-details/cardRequests';
import SendMoney from '@/pages/User/dashboardInsideForms/sendMoney/main';
import TotalTransactions from '@/pages/Admin/Fiat/TotalTransactions/main';
import PendingTransactionsList from '@/pages/Admin/Fiat/PendingTransactions/main';
import OriginalInvoices from '@/pages/User/InvoiceDashboard/OriginalInvoices/main';
import RecurringInvoices from '@/pages/User/InvoiceDashboard/RecurringInvoices/main';
import AddBeneficiaryForm from '@/pages/User/dashboardInsideForms/sendMoney/addNewBenefiecry';
import SelectBeneficiary from '@/pages/User/dashboardInsideForms/sendMoney/selectBenefiecery';

  import { useAuth } from '@/contexts/authContext';
  import path from 'path';
  // --- Allowed paths for incomplete KYC ---
const UNRESTRICTED_ROUTES = ['/dashboard', '/kyc'];

// --- Auth Route Wrapper ---
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, kycStatus,subscriptionDetails, logout } = useAuth();

  if (loading || kycStatus === null || kycStatus === undefined) return null;

  const currentPath = window.location.pathname;

  // If user not authenticated, redirect to login/home
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // If KYC is completed, allow ALL routes!
  if (kycStatus === 'completed') return children;

  // If KYC is not completed, allow only /dashboard or /kyc
  if (!UNRESTRICTED_ROUTES.includes(currentPath)) {
    // Not allowed? Redirect to /kyc if not already there, else /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Allowed path for incomplete KYC? Allow!
  return children;
};

// if admin authenticated, redirect to admin dashboard
const AdminPrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
    if (loading) return null; // wait for auth state to load before redirecting
  return isAuthenticated ? children : <Navigate to="/login-admin" replace />;
} 
// if user autenticated, restrict guest routes
const GuestPrivateRoute = ({ children }: { children: JSX.Element }) => {
  // const { isAuthenticated, isAdminAuthenticated } = useAuth();
  // if (isAdminAuthenticated) {
  //   return <Navigate to="/admin/dashboard" replace />;
  // }
  // if (isAuthenticated) {
  //   return <Navigate to="/dashboard" replace />;
  // }
  return children;
};

// --- Admin Auth Route Wrapper ---
const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAdminAuthenticated, loading } = useAuth();
  if (loading) return null; // wait for admin auth state to load before redirecting
  return isAdminAuthenticated ? children : <Navigate to="/login-admin" replace />;
};

  const guestRoutes = [
      { path: '/', element: <Home /> },
      { path: '*', element: <NotFound /> },
      { path: '/contact', element: <Contact /> },
      { path: '/login', element: <UserLogin /> },
      { path: '/register', element: <UserSignup /> },
      { path: '/login-admin', element: <AdminLogin /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ]
    
      const authRoutes = [
        { path: '/kyc', element: <KYC /> },
        { path: '/demo', element: <Demo /> },
        { path: '/spot', element: <Spot /> },
        { path: '/cards', element: <Cards /> },
        { path: '/tokens', element: <Tokens/> },
        { path: '/wallets', element: <Wallet /> },
        { path: '/clients', element: <Clients /> },
        { path: '/currency', element: <Currency/> },
        { path: '/help-center', element: <Tickets /> },
        { path: '/send-money', element: <SendMoney /> },
        { path: '/refer-earn', element: <ReferEarn /> },
        { path: '/add-client', element: <AddClient /> },
        { path: '/statements', element: <Statements /> },
        { path: '/blockchain', element: <Blockchain /> },
        { path: '/dashboard', element: <UserDashboard /> },
        { path: '/buysellswap', element: <BuySellSwap /> },
        { path: '/my-plans', element: <MySubscriptions /> },
        { path: '/user-profile', element: <UserProfile /> },
        { path: '/admin-dashboard', element: <Dashboard /> },
        { path: '/transactions', element: <Transactions /> },
        { path: '/all-plans', element: <AllSubscriptions /> },
        { path: '/card-requests', element: <CardRequests /> },
        { path: '/summary-tokens', element: <SummaryTokens /> },
        { path: '/exchange-pairs', element: <ExchangePairs /> },
        { path: '/beneficiary', element: <SelectBeneficiary /> },
        { path: '/wallet-accounts', element: <WalletAccounts /> },
        { path: '/buysellswap/proceed', element: <ProceedPage /> },
        { path: '/instrument-pairs', element: <InstrumentPairs /> },
        { path: '/crypto-dashboard', element: <CryptoDashboard /> },
        { path: '/register-business', element: <BusinessRegister /> },
        { path: '/add-beneficiary', element: <AddBeneficiaryForm /> },
        { path: '/invoice-dashboard', element: <InvoiceDashboard /> },
        { path: '/original-invoices', element: < OriginalInvoices /> },
        { path: '/recurring-invoices', element: < RecurringInvoices /> },
      ]

// --- Admin Routes ---
const adminRoutes = [
      { path: '/admin/revenue', element: <Revenue /> },
      { path: '/admin/kyc-mode', element: <KycMode /> },
      { path: '/admin/invoices', element: <Invoice /> },
      { path: '/admin/subadmin', element: <SubAdmin /> },
      { path: '/admin/user-list', element: <UserList /> },
      { path: '/admin/coin-list', element: <CoinList /> },
      { path: '/admin/help-center', element: <Ticket /> },
      { path: '/admin/profile', element: <AdminProfile /> },
      { path: '/admin/fee-details', element: <FeeDetail /> },
      { path: '/admin/user-kyc-details', element: <UserKyc /> },
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin/currency-list', element: <CurrencyList /> },
      { path: '/admin/notifications', element: <Notification /> },
      { path: '/admin/wallet-request', element: <WalletRequest /> },
      { path: '/admin/crypto-transfer', element: <TransferReuest /> },
      { path: '/admin/business-kyc-details', element: <BusinessKyc /> },
      { path: '/admin/transaction-list', element: <TotalTransactions /> },
      {path: '/admin/pending-transactions', element: <PendingTransactionsList />,},
    ]
const router = createBrowserRouter([
  {
    element: (
      <GuestPrivateRoute>
        <RootLayout />
      </GuestPrivateRoute>
    ),
    children: guestRoutes,
  },

  {
    element: (
      <PrivateRoute>
        <MinimalLayout />
      </PrivateRoute>
    ),
    children: authRoutes,
  },
  
  {
    element: <AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>,
    children: adminRoutes,
  },

]);

export default router;
