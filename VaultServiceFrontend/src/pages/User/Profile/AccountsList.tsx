
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AccountsList = () => {
  const theme = useTheme();

  const accounts = [
    {
      flag: '🇺🇸',
      currency: 'GBP',
      iban: 'GB100001949',
      bic: '201949',
      balance: '£3189.75658769999997'
    },
    {
      flag: '🇪🇺',
      currency: 'GBP',
      iban: 'GB100001949',
      bic: '201949',
      balance: '£3189.75658769999997'
    },
    {
      flag: '🇦🇼',
      currency: 'GBP',
      iban: 'GB100001949',
      bic: '201949',
      balance: '£3189.75658769999997'
    }
  ];

  return (
    <Box sx={{backgroundColor:theme.palette.background.default}}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
        Accounts List
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {accounts.map((account, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              color: theme.palette.text.primary,
              }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: theme.palette.text.primary,
              }}
            >
              {account.flag}
            </Box>
            <Box sx={{ flex: 1 , color: theme.palette.text.primary }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" >
                  CURRENCY: <strong>{account.currency}</strong>
                </Typography>
                <Typography variant="caption" >
                  IBAN / ROUTING / ACCOUNT NUMBER: <strong>{account.iban}</strong>
                </Typography>
                <Typography variant="caption" >
                  BIC / IFSC: <strong>{account.bic}</strong>
                </Typography>
                <Typography variant="caption" >
                  BALANCE: <strong>{account.balance}</strong>
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AccountsList;
