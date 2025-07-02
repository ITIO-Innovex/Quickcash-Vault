import React, { useEffect, useState } from 'react';
import { Box, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import UserInformation from './UserInformation';
import TabNavigation from './TabNavigation';
import AccountsList from './AccountsList';
import BeneficiaryAccountsList from './BeneficiaryAccountsList';
import LoginHistory from './LoginHistory';
import SecurityForm from './SecurityForm';
import UpdateDetails from './UpdateDetails';
import Documents from './Documents';
import UserScope from './UserScopes';

interface VaultUser {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  passwordLastChangeDate: string;
  status: string;
  authorizationMfaActive: boolean;
  userScopes: string[];
}

const UserProfile = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [activeTab, setActiveTab] = useState('User Information');
  const [activeSubTab, setActiveSubTab] = useState('User Scopes');
  const [userData, setUserData] = useState<VaultUser | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/customer/vault/user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        setUserData(result.data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const tabs = [
    'User Information',
    'Session History',
    'Security',
    'Update Details',
    'Documents'
  ];

  const subTabs = ['User Scopes', 'Accounts List', 'Beneficiary Accounts List'];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'User Scopes':
        return <UserScope userScopes={userData?.userScopes || []} />;
      case 'Accounts List':
        return <AccountsList />;
      case 'Beneficiary Accounts List':
        return <BeneficiaryAccountsList />;
      default:
        return <UserScope userScopes={userData?.userScopes || []} />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'User Information':
        return (
          <Box>
            <UserInformation userData={userData} loading={loading} />
            <Box sx={{ mt: 3 }}>
              <TabNavigation
                tabs={subTabs}
                activeTab={activeSubTab}
                onTabChange={setActiveSubTab}
                orientation={isMobile ? 'vertical' : 'horizontal'}
                variant={isMobile ? 'standard' : 'scrollable'}
              />
              <Box sx={{ mt: 2 }}>
                {renderSubTabContent()}
              </Box>
            </Box>
          </Box>
        );
      case 'Session History':
        return <LoginHistory />;
      case 'Security':
        return <SecurityForm />;
      case 'Update Details':
        return <UpdateDetails />;
      case 'Documents':
        return <Documents />;
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center', color: theme.palette.text.secondary }}>
            {activeTab} content will be implemented here
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: 2,
          overflow: 'hidden'
        }}
        data-theme={theme.palette.mode}
      >
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          variant={isMobile ? 'standard' : 'scrollable'}
        />
        {renderTabContent()}
      </Box>
    </Container>
  );
};

export default UserProfile;
