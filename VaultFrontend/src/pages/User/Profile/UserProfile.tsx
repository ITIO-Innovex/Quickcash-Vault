import axios from 'axios'; 
import Mfa from './MultiFactorAuth';
import UserScope from './UserScopes';
import UpgradeKYC from './UpgradeKYC';
import LoginHistory from './LoginHistory';
import SecurityForm from './SecurityForm';
import TabNavigation from './TabNavigation';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import UserInformation from './UserInformation';
import { Box, Container, useMediaQuery } from '@mui/material';

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
  const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios(`${url}/customer/vault/user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const response = res.data;
        console.log('data',response)
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const hasBankAccountScope = !userData?.userScopes?.includes('bank_account:forbidden');

  const tabs = [
    'User Information',
    'Session History',
    'Security',
     ...(hasBankAccountScope ? ['Upgrade KYC'] : []),
    'MFA'
  ];

  const subTabs = ['User Scopes'];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'User Scopes':
        return <UserScope userScopes={userData?.userScopes || []} />;
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
              <TabNavigation tabs={subTabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} orientation={isMobile ? 'vertical' : 'horizontal'} variant={isMobile ? 'standard' : 'scrollable'} />
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
      case 'Upgrade KYC':
        return <UpgradeKYC />;
      case 'MFA':
        return < Mfa/>;
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
