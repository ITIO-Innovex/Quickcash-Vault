
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomButton from '../../../components/CustomButton';
import CustomDropdown from '../../../components/CustomDropdown';
import CustomInputField from '../../../components/CustomInputField';
import {Box ,Card, CardContent, Typography, useTheme, LinearProgress, useMediaQuery, Checkbox, FormControlLabel, Radio, RadioGroup} from '@mui/material';
import CommonTooltip from '@/components/common/toolTip';

const FormPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize activeTab from location state or default to 'buy'
  const [activeTab, setActiveTab] = useState(location.state?.type || 'buy');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [coin, setCoin] = useState('BTC');
  const [youSend, setYouSend] = useState('');
  const [youReceive, setYouReceive] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [chargesPaidBy, setChargesPaidBy] = useState('OUR');

  // Log activeTab changes for debugging
  useEffect(() => {
    console.log('FormPage - Active Tab Changed:', activeTab);
    console.log('FormPage - Current amount:', amount);
    console.log('FormPage - Current youSend:', youSend);
    console.log('FormPage - Current youReceive:', youReceive);
    console.log('FormPage - Is confirmed:', isConfirmed);
  }, [activeTab, amount, youSend, youReceive, isConfirmed]);

  // Update activeTab when location state changes
  useEffect(() => {
    const newActiveTab = location.state?.type || 'buy';
    if (newActiveTab !== activeTab) {
      console.log('FormPage - Updating activeTab from location state:', newActiveTab);
      setActiveTab(newActiveTab);
    }
  }, [location.state?.type]);

  const handleTabChange = (newValue: string) => {
    console.log('FormPage - Tab Change Triggered:', newValue);
    
    setActiveTab(newValue);
    setAmount('');
    setYouSend('');
    setYouReceive('');
    setIsConfirmed(false);
    setChargesPaidBy('OUR');

    // Navigate with the new tab state to update SecondSection
    navigate('/buysellswap', {
      state: {
        type: newValue,
        timestamp: Date.now()
      },
      replace: true
    });

    console.log('FormPage - Navigation triggered with state:', { type: newValue, timestamp: Date.now() });
  };

  const handleProceed = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    navigate('/buysellswap/proceed', {
      state: {
        type: activeTab,
        amount: activeTab === 'swap' ? youSend : amount,
        currency: activeTab === 'swap' ? 'USD' : currency,
        coin: activeTab === 'swap' ? 'BTC' : coin,
        youReceive: activeTab === 'swap' ? youReceive : '1.002958728248335',
      },
    });
  };

  const currencyOptions = [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
  ];

  const coinOptions = [
    { label: 'Bitcoin (BTC)', value: 'BTC' },
    { label: 'Ethereum (ETH)', value: 'ETH' },
    { label: 'Solana (SOL)', value: 'SOL' },
    { label: 'Binance Coin (BNB)', value: 'BNB' },
  ];

  // Updated validation logic - more lenient and includes logging
  const isFormValid = () => {
    console.log('FormPage - Checking form validity...');
    
    if (activeTab === 'swap') {
      const isValidSwap = youSend && parseFloat(youSend) > 0 && youReceive && parseFloat(youReceive) > 0;
      console.log('FormPage - Swap validation:', { youSend, youReceive, isValidSwap });
      return isValidSwap;
    } else {
      // For buy/sell, only require amount to be a positive number
      const isValidAmount = amount && parseFloat(amount) > 0;
      console.log('FormPage - Buy/Sell validation:', { amount, isValidAmount });
      return isValidAmount;
    }
  };

  // Calculate estimated rate and crypto fees
  const cryptoFees = parseFloat(amount || '0') * 0.02; // 2% fee
  const estimatedRate = '0.00050496936433567';

  console.log('FormPage - Rendering with activeTab:', activeTab, 'Form valid:', isFormValid());

  return (
    <>
      <Box className="crypto-form-container">

        {/* Tab Buttons */}
        <Box className="crypto-tab-buttons">
          <CommonTooltip title="Buy popular cryptocurrencies quickly and securely using your wallet balance or payment methods.">
              <span>
                <CustomButton
                  className={`crypto-tab-button ${activeTab === 'buy' ? 'active' : ''}`}
                  onClick={() => handleTabChange('buy')}
                  sx={{
                    backgroundColor: activeTab === 'buy' ? '#483594' : 'transparent',
                    color: activeTab === 'buy' ? 'white' : theme.palette.text.primary,
                    border: activeTab === 'buy' ? 'none' : `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      backgroundColor: activeTab === 'buy' ? '#3d2a7a' : theme.palette.action.hover
                    }
                  }}
                >
                  Crypto Buy
                </CustomButton>
              </span>
            </CommonTooltip>

          <CommonTooltip title="Convert your crypto into fiat instantly and withdraw to your bank or wallet with ease.">
              <span>
          <CustomButton
            className={`crypto-tab-button ${activeTab === 'sell' ? 'active' : ''}`}
            onClick={() => handleTabChange('sell')}
            sx={{
              backgroundColor: activeTab === 'sell' ? '#483594' : 'transparent',
              color: activeTab === 'sell' ? 'white' : theme.palette.text.primary,
              border: activeTab === 'sell' ? 'none' : `1px solid ${theme.palette.divider}`,
              '&:hover': {
                backgroundColor: activeTab === 'sell' ? '#3d2a7a' : theme.palette.action.hover
              }
            }}
          >
            Crypto Sell
           </CustomButton>
              </span>
            </CommonTooltip>

            <CommonTooltip title="Easily exchange one cryptocurrency for another at real-time rates without needing to sell or withdraw.">
              <span>
          <CustomButton
            className={`crypto-tab-button ${activeTab === 'swap' ? 'active' : ''}`}
            onClick={() => handleTabChange('swap')}
            sx={{
              backgroundColor: activeTab === 'swap' ? '#483594' : 'transparent',
              color: activeTab === 'swap' ? 'white' : theme.palette.text.primary,
              border: activeTab === 'swap' ? 'none' : `1px solid ${theme.palette.divider}`,
              '&:hover': {
                backgroundColor: activeTab === 'swap' ? '#3d2a7a' : theme.palette.action.hover
              }
            }}
          >
            Crypto Swap
          </CustomButton>
          </span>
          </CommonTooltip>
        </Box>

        {/* Form Content */}
        <Card 
          className="crypto-form-card"
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <CardContent className="crypto-form-content">
            {(activeTab === 'buy' || activeTab === 'sell') && (
              <>
                {/* Amount Section */}
                <Box 
                  className="crypto-form-section"
                >
                  <Box className="crypto-form-row">
                    <Box className="crypto-form-field">
                      <Typography variant="subtitle2" className="crypto-form-label" sx={{ color: theme.palette.text.primary }}>
                        AMOUNT
                      </Typography>
                      <CustomInputField
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const newAmount = e.target.value;
                          console.log('Amount changed to:', newAmount);
                          setAmount(newAmount);
                        }}
                        placeholder="$ 200"
                        className="crypto-amount-input"
                      />
                      <Typography variant="caption" className="crypto-fees-text" sx={{ color: theme.palette.text.secondary }}>
                        Crypto Fees: ${cryptoFees.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box className="crypto-form-field">
                      <Typography variant="subtitle2" className="crypto-form-label" sx={{ color: theme.palette.text.primary }}>
                        CURRENCY
                      </Typography>
                      <CustomDropdown
                        label=""
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as string)}
                        options={currencyOptions}
                      />
                      <Typography variant="caption" className="crypto-rate-text" sx={{ color: theme.palette.text.secondary }}>
                        Estimated Rate: {estimatedRate}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Conversion Arrow */}
                  <Box className="crypto-conversion-arrow">
                    <Box 
                      className="crypto-arrow-icon"
                      sx={{ backgroundColor: '#483594' }}
                    >
                      ↓
                    </Box>
                  </Box>

                  {/* You Get Section */}
                  <Box className="crypto-form-row">
                    <Box className="crypto-form-field">
                      <Typography variant="subtitle2" className="crypto-form-label" sx={{ color: theme.palette.text.primary }}>
                        YOU GET
                      </Typography>
                      <Box 
                        className="crypto-result-display"
                        sx={{ 
                          color: theme.palette.text.primary,
                          border: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        1.002958728248325
                      </Box>
                    </Box>
                    
                    <Box className="crypto-form-field">
                      <Typography variant="subtitle2" className="crypto-form-label" sx={{ color: theme.palette.text.primary }}>
                        COIN
                      </Typography>
                      <CustomDropdown
                        label=""
                        value={coin}
                        onChange={(e) => setCoin(e.target.value as string)}
                        options={coinOptions}
                      />
                    </Box>
                  </Box>
                </Box>
              </>
            )}

            {activeTab === 'swap' && (
              <>
                <Box 
                  className="crypto-swap-container"
                >
                  <Box className="crypto-swap-field">
                    <Typography variant="subtitle1" className="crypto-swap-label" sx={{ color: theme.palette.text.primary }}>
                      You Send
                    </Typography>
                    <Box className="crypto-swap-input-group">
                      <CustomInputField
                        type="number"
                        value={youSend}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          console.log('YouSend changed to:', newValue);
                          setYouSend(newValue);
                        }}
                        placeholder="0"
                      />
                      <CustomDropdown
                        label=""
                        value="USD"
                        onChange={() => {}}
                        options={currencyOptions}
                        sx={{width:'300px'}}
                      />
                    </Box>
                  </Box>

                  <Box className="crypto-swap-arrow-container">
                    <Box 
                      className="crypto-swap-arrow"
                      sx={{ backgroundColor: '#483594' }}
                    >
                      ⇄
                    </Box>
                  </Box>

                  <Box className="crypto-swap-field">
                    <Typography variant="subtitle1" className="crypto-swap-label" sx={{ color: theme.palette.text.primary }}>
                      You Receive
                    </Typography>
                    <Box className="crypto-swap-input-group">
                      <CustomInputField
                        type="number"
                        value={youReceive}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          console.log('YouReceive changed to:', newValue);
                          setYouReceive(newValue);
                        }}
                        placeholder="0.00"
                        className="crypto-swap-input"
                      />
                      <CustomDropdown
                        label=""
                        value="BTC"
                        onChange={() => {}}
                        options={coinOptions}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Confirmation checkbox for swap */}
                <Box className="crypto-form-field" sx={{ mt: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isConfirmed}
                        onChange={(e) => {
                          console.log('Checkbox changed to:', e.target.checked);
                          setIsConfirmed(e.target.checked);
                        }}
                        sx={{
                          color: theme.palette.text.secondary,
                          '&.Mui-checked': {
                            color: '#483594',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                        I confirm the above swap details are correct
                      </Typography>
                    }
                  />
                </Box>
              </>
            )}

            {/* Loading Progress */}
            {isLoading && (
              <Box className="crypto-loading-container">
                <LinearProgress 
                  className="crypto-loading-progress"
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#483594'
                    }
                  }}
                />
                <Typography variant="body2" className="crypto-loading-text" sx={{ color: theme.palette.text.secondary }}>
                  Processing your request...
                </Typography>
              </Box>
            )}

            {/* Proceed Button */}
            <Box className="crypto-proceed-container">
              <CustomButton
                fullWidth
                onClick={handleProceed}
                disabled={!isFormValid() || isLoading || (activeTab === 'swap' && !isConfirmed)}
                loading={isLoading}
                className="crypto-proceed-button"
                sx={{
                  backgroundColor: '#483594',
                  padding: '16px',
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#3d2a7a',
                  },
                  '&:disabled': {
                    backgroundColor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled
                  }
                }}
              >
                Proceed →
              </CustomButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default FormPage;
