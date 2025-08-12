import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/types/jwt';
import api from '@/helpers/apiHelper';

interface SubscriptionPlanDetails {
  id: string;
  name: string;
  description: string;
  status: string;
  paymentStatus?: string;
}

interface AuthContextType {
  token: string | null;
  user: JwtPayload['data'] | null;
  isAuthenticated: boolean;
  subscriptionDetails: SubscriptionPlanDetails[] | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  kycStatus: string | null; 
  
  // NEW for admin
  adminToken: string | null;
  admin: JwtPayload['data'] | null;
  isAdminAuthenticated: boolean;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null); 
  const [user, setUser] = useState<JwtPayload['data'] | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true); 
  // NEW admin states
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<JwtPayload['data'] | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // to fetch user's subscription detais
    useEffect(() => {
    if (token) { 
      api.get(`${API_URL}/customer/subscription-details`, {
        headers: { Authorization: `Bearer ${token}` }
      })
       .then(res => {
        // Subscription details response 
        const allSubs = res.data.subscriptionDetails;

        setSubscriptionDetails(allSubs);

        if (allSubs && allSubs.length > 0) {
          // Log each subscription plan description/status
          allSubs.forEach(plan => {
            console.log(`[Subscription] Name: ${plan.name} | Description: ${plan.description} | Status: ${plan.status} | Payment Status: ${plan.paymentStatus}`);
          });
        } else {
          console.log("[Subscription] No active plans found for user.");
        }
      })
        .catch(err => {
        setSubscriptionDetails(null);
        console.log("[Subscription] API Error or no subscription found:", err?.message);
      });
    } else {
      setSubscriptionDetails(null);
    }
  }, [token]);

    // Function to fetch KYC status independently
  const fetchKycStatus = async () => {
    try {
      const res = await api.get(`${API_URL}/customer/kyc-status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const reviewStatus = res.data?.status;
      console.log('KYC Status Response from auth context:', res.data);
      setKycStatus(reviewStatus); // Store KYC status here
    } catch (err) {
      console.error('Error fetching KYC status:', err);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenValid(storedToken)) {
      const decoded = jwtDecode<JwtPayload>(storedToken);
      setToken(storedToken);
      setUser(decoded.data);
      setIsAuthenticated(true);
      fetchKycStatus();   // Fetch KYC status on initial load
    } else {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setKycStatus(null); // Reset KYC status if token is invalid
    }
    

    // Admin token logic
    const storedAdminToken = localStorage.getItem('admin');
    if (storedAdminToken && isTokenValid(storedAdminToken)) {
      const decoded = jwtDecode<JwtPayload>(storedAdminToken);
      setAdminToken(storedAdminToken);
      setAdmin(decoded.data);
      setIsAdminAuthenticated(true);
    } else {
      localStorage.removeItem('admin');
      setAdminToken(null);
      setAdmin(null);
      setIsAdminAuthenticated(false);
    }
    setLoading(false); // auth check finished
  }, []);

  const login = (newToken: string) => {
    if (isTokenValid(newToken)) {
      const decoded = jwtDecode<JwtPayload>(newToken);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(decoded.data);
      setIsAuthenticated(true);
      fetchKycStatus(); // Fetch KYC status upon login
    } else {
      logout();
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setKycStatus(null);
  };

  // NEW admin login/logout
  const adminLogin = (newToken: string) => {
    if (isTokenValid(newToken)) {
      const decoded = jwtDecode<JwtPayload>(newToken);
      localStorage.setItem('admin', newToken);
      setAdminToken(newToken);
      setAdmin(decoded.data);
      setIsAdminAuthenticated(true);
    } else {
      adminLogout();
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('admin');
    setAdminToken(null);
    setAdmin(null);
    setIsAdminAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        subscriptionDetails,
        loading,
        login,
        kycStatus,
        logout,
        // NEW admin values
        adminToken,
        admin,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

