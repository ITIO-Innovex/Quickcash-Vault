import 'swiper/css';
import 'swiper/css/pagination';
import api from '@/helpers/apiHelper';
import { Link} from 'react-router-dom';
import { Pagination } from 'swiper/modules';
import { useAppToast } from '@/utils/Toast';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Sell, Wallet } from '@mui/icons-material';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import SelectCryptoModal from './selectCurrencyModal';
import CommonTooltip from '@/components/common/toolTip';
import CryptoWithdrawModal from "./CryptoWithdrawModal";
import CustomInput from '@/components/CustomInputField';
import DirectExchangeModal from "./DirectExchangeModal";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Box, Button, Card, CardContent, Tab, Tabs, Typography, useTheme,} from '@mui/material';
const url = import.meta.env.VITE_NODE_ENV === 'production' ? 'api' : 'api';

const FiatCrypto = () => {
  const theme = useTheme();
  const toast = useAppToast();
  const [ibanError, setIbanError] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawType] = useState('BANK_TRANSFER');
  const [withdrawCurrency, setWithdrawCurrency] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawFromAccount, setWithdrawFromAccount] = useState('');
  const [withdrawIban, setWithdrawIban] = useState('');
  const [withdrawBic, setWithdrawBic] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Fiat');
  const [ibanAccounts, setIbanAccounts] = useState([]);
  const [ibanLoading, setIbanLoading] = useState(true);
  const [isIbanModalOpen, setIsIbanModalOpen] = useState(false);
  const [isPayinModalOpen, setIsPayinModalOpen] = useState(false);
  const [payinAccount, setPayinAccount] = useState('');
  const [payinFromCurrency, setPayinFromCurrency] = useState('');
  const [payinToCurrency, setPayinToCurrency] = useState('');
  const [payinFromAccount, setPayinFromAccount] = useState('');
  const [ibanCurrency, setIbanCurrency] = useState('');
  const [isDirectExchangeOpen, setIsDirectExchangeOpen] = useState(false);
  const handleExchangeOpen = () => setIsDirectExchangeOpen(true);
  const handleExchangeClose = () => setIsDirectExchangeOpen(false);
  const [isCurrencyExchnageOpen, setIsCurrencyExchnageOpen] = useState(false);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => { setActiveTab(newValue);};
  const handleCurrencyExchangeOpen = () => setIsCurrencyExchnageOpen(true);
  const handleCurrencyExchangeClose = () => setIsCurrencyExchnageOpen(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);

  const handleOpen = () => setIsCryptoModalOpen(true);
  const handleClose = () => setIsCryptoModalOpen(false);

  const [selectedCrypto, setSelectedCrypto] = useState({
    currency: 'USD',
    account: 'US1000000014',
    balance: '$ 10145.83',
    flag: '../flags/usa.png',
  });

  const fiatAccounts = [
    { currency: 'USD', account: 'US1000000014', balance: '$ 10145.828', flag: 'US'},
    { currency: 'INR', account: 'IN1000000015', balance: '484575.926', flag: 'IN' },
    { currency: 'INR', account: 'IN1000000015', balance: '164575.926', flag: 'IN' },
  ];

  useEffect(() => {
  // Call API on initial mount
  const fetchIban = async () => {
    setIbanLoading(true);
    setIbanError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`${url}/iban/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIbanAccounts(res.data || []);
    } catch (err) {
      setIbanError(
        err.response?.data?.message || "Couldn't load IBANs. Please try again."
      );
      setIbanAccounts([]);
    } finally {
      setIbanLoading(false);
    }
  };
  fetchIban();
}, []);

    // Fetch all wallets (on Crypto tab)
    const fetchWallets = async () => {
      setLoadingWallets(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token not found in localStorage');
          setLoadingWallets(false);
          return;
        }
        const response = await api.get(`${url}/wallet/all-wallets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setWallets(response.data.data);
          console.log('wallet response',response.data.data)
        } else {
          toast.error('Failed to fetch wallets!');
          setWallets([]);
        }
      } catch (err) {
        console.error('Error fetching wallets:', err);
        toast.error('Failed to fetch wallets!');
        setWallets([]);
      } finally {
        setLoadingWallets(false);
      }
    };
    useEffect(() => {
      if (activeTab === 'Crypto') {
        fetchWallets();
      }
      // eslint-disable-next-line
    }, [activeTab]);

    const handleIbanModalOpen = (e) => {
    e.preventDefault();   
    setIbanCurrency('EUR');  
    setIsIbanModalOpen(true);
    };

    const handleIbanModalClose = () => setIsIbanModalOpen(false);

    const handleIbanCreate = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        if (!token) {
        toast.error("No token found in localStorage");
        return;
        }
        // API call
        const res = await api.post(
        `/${url}/iban/create`,
        { currency: ibanCurrency }, // EUR by default
        );
        toast.success("IBAN issuance request created successfully!");
        setIsIbanModalOpen(false);
        console.log("IBAN create response:", res.data);
    } catch (err) {
        let errorMsg = "Something went wrong!";
        if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMsg = err.response.data.errors[0].description;
        } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
        }
        toast.error(errorMsg);
        console.error("IBAN create error:", err);
    }
    };

    const handlePayinOpen = () => {
    setPayinAccount('');
    setPayinFromCurrency('');
    setPayinToCurrency('');
    setPayinFromAccount('');
    setIsPayinModalOpen(true);
    };
    const handlePayinClose = () => setIsPayinModalOpen(false);

    const handlePayinSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        if (!token) {
        toast.error("No token found in localStorage");
        return;
        }

    // API POST call
    const res = await api.post(
      `${url}/operation/payin`,
      {
        account: payinAccount,
        fromCurrency: payinFromCurrency,
        toCurrency: payinToCurrency,
        fromAccount: payinFromAccount,
      },
    );

    toast.success("Payin operation successful!");
    setIsPayinModalOpen(false);
    // Optionally: reset modal fields, refresh balances, etc.
  } catch (err) {
    let errorMsg = "Something went wrong!";
    // Try to get backend error array/detail
    if (err.response?.data?.errors && err.response.data.errors.length > 0) {
      errorMsg = err.response.data.errors[0].description;
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
    toast.error(errorMsg);
    console.error("Payin API error:", err);
  }
    };

    // Withdrawal functionality begins here 
    const handleWithdrawOpen = () => {
      setWithdrawCurrency('');
      setWithdrawAmount('');
      setWithdrawFromAccount('');
      setWithdrawIban('');
      setWithdrawBic('');
      setIsWithdrawModalOpen(true);
    };

    const handleWithdrawClose = () => setIsWithdrawModalOpen(false);

   const handleWithdrawSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found in localStorage");
      return;
    }

    // API POST call
    const res = await api.post(
      `${url}/operation/withdraw`,
      {
        type: withdrawType, // BANK_TRANSFER
        currency: withdrawCurrency,
        amount: withdrawAmount,
        fromAccount: withdrawFromAccount,
        iban: withdrawIban,
        bicOrSwiftCode: withdrawBic,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Withdrawal successful!");
    setIsWithdrawModalOpen(false);
    // Optionally: reset fields, refresh wallet, etc.
    console.log("Withdraw API response:", res.data);
  } catch (err) {
    let errorMsg = "Something went wrong!";
    if (err.response?.data?.errors && err.response.data.errors.length > 0) {
      errorMsg = err.response.data.errors[0].description;
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
    toast.error(errorMsg);
    console.error("Withdraw API error:", err);
  }
};

  return (
    <>
      <Box>
        <Card>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }} style={{backgroundColor:theme.palette.background.default}}>
            <Box className="crypto-section-header" >
              <Tabs value={activeTab} onChange={handleTabChange}
                sx={{  minHeight: '48px', '& .MuiTab-root': { minHeight: '48px' }, }} >
                <Tab label="IBAN" value="Fiat" className="label-fiat-crypto" />
                <Tab label="Crypto" value="Crypto" className="label-fiat-crypto"/>
              </Tabs>
            </Box>

            {activeTab === 'Fiat' && (
                //   ibanLoading ? (
                //     <Box textAlign="center" py={6}>
                //     Loading...
                //     </Box>
                // ) : ibanAccounts.length === 0 ? (
                //     <Box textAlign="center" py={7}>
                //     <Typography variant="h6" color="primary" fontWeight="bold">
                //         No IBAN found
                //     </Typography>
                //     <Typography variant="body1" sx={{ mt: 1 }}>
                //         Create an&nbsp;
                //         <a href="" style={{ color: '#845ec2', textDecoration: 'underline', fontWeight: 500,cursor:'pointer' }}onClick={handleIbanModalOpen} > IBAN issuance request </a>
                //     </Typography>
                //     </Box>
                // ) : (
              <Box>
                {/* Header Section */}
                <Box className="header-section" sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, }} >
                  <Box className="img-section" sx={{ mb: { xs: 1, sm: 0 } }}>
                    <img src="https://flagsapi.com/US/flat/24.png" alt="USD Flag" className="img-round" />

                    <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: '#1f2937' }} >
                      USD Account : $ 10145.83
                    </Typography>
                    <ExpandMoreIcon sx={{ width: 16, height: 16, color: '#4b5563' }} />
                  </Box>

                  <Box className="button-section" sx={{ display: 'flex', gap: 1 }} >
                    <CommonTooltip title="Easily add funds to your wallet using your debit card or linked bank account for instant access.">
                      <Button className="custom-button" onClick={handlePayinOpen}>
                        <AddIcon className="icon-size" />
                        <span className="button-text">Payin</span>
                      </Button>
                    </CommonTooltip>

                    <CommonTooltip title="Seamlessly convert between multiple currencies with real-time exchange rates and low fees.">
                      <Button className="custom-button" onClick={handleExchangeOpen} >
                        <CompareArrowsIcon className="icon-size" />
                        <span className="button-text">Exchange</span>
                      </Button>
                    </CommonTooltip>

                    <CommonTooltip title="Send money instantly to friends, family, or other users—locally or internationally.">
                      <Button className="custom-button" onClick={handleWithdrawOpen}>
                        <SendIcon className="icon-size" />
                        <span className="button-text">withdraw</span>
                      </Button>
                    </CommonTooltip>
                  </Box>
                </Box>

                {/* Swiper Slider */}
                <Swiper spaceBetween={16} slidesPerView={1} pagination={{ clickable: true }} breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 20, },
                    992: { slidesPerView: 3, spaceBetween: 30, },
                    1400: { slidesPerView: 4, spaceBetween: 30, },
                  }}
                  modules={[Pagination]}
                  style={{ paddingBottom: '2rem' }}
                >
                  {fiatAccounts.map((account, index) => {
                    const isActive = index === 0;
                    return (
                      <SwiperSlide key={index}>
                        <Card
                          className={`crypto-card ${isActive ? 'active' : 'inactive'}`}
                        >
                          <CardContent className="card-content-custom">
                            <Box className="main-content-section">
                              <img
                                src={`https://flagsapi.com/${account.flag}/flat/32.png`}
                                alt={`${account.currency} Flag`}
                                className="img-round"
                              />
                              <Typography
                                className={`currency-subtitle ${isActive ? 'active' : ''}`}
                                variant="subtitle1"
                              >
                                {account.currency}
                              </Typography>
                            </Box>

                            <Box className="currency-detail">
                              <Typography
                                variant="body2"
                                sx={{ color: isActive ? '#e5e7eb' : '#4b5563' }}
                              >
                                {account.account}
                              </Typography>
                              <Typography
                                className={`account-balance ${isActive ? 'active' : ''}`}
                                variant="body1"
                              >
                                {account.balance}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </Box>
                // )
            )}

            {activeTab === 'Crypto' && (
              <Box>
                {/* Header */}
                <Box className="header-section"
                  sx={{  flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, }}>
                     <Box className="button-section" sx={{ display: 'flex', gap: 1, ml: 'auto' }} >
                   <CommonTooltip title="Send money instantly to friends, family, or other users—locally or internationally.">
                      <Button className="custom-button" onClick={handleOpen} >
                        <SendIcon className="icon-size" />
                        <span className="button-text">withdraw</span>
                      </Button>
                    </CommonTooltip>
                    </Box>
                </Box>
                {/* Wallet Slider */}
                {loadingWallets ? (
                  <Box textAlign="center" py={5}>Loading...</Box>
                ) : (
                  <Swiper spaceBetween={16} slidesPerView={1}
                    pagination={{ clickable: true }}
                    breakpoints={{
                      600: { slidesPerView: 1 },
                      960: { slidesPerView: 3 },
                    }}
                    modules={[Pagination]}
                    style={{ paddingBottom: '1.5rem' }}
                  >
                  {wallets.map((wallet, index) => {
                    const isActive = index === 0;
                    return (
                      <SwiperSlide key={wallet._id || index}>
                        <Card className={`crypto-card ${isActive ? 'active' : 'inactive'}`}>
                          <CardContent className="card-content-custom">
                            <Box className="main-content-section">
                             <img
                                src={`https://assets.coincap.io/assets/icons/${wallet.blockchain}@2x.png`}
                                alt={`${wallet.symbol} Logo`}
                                className="img-round"
                                style={{ width: 32, height: 32 }}
                                onError={e => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = '/default-coin.png';
                                }}
                              />
                            </Box>
                            <Box className="currency-detail">
                              <Typography
                                variant="body2"
                                sx={{ color: isActive ? '#e5e7eb' : '#4b5563' }}
                              >
                                {wallet.address}
                              </Typography>
                              <Typography
                                className={`account-balance ${isActive ? 'active' : ''}`}
                                variant="body1"
                              >
                                {wallet.type}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </SwiperSlide>
                    );
                  })}

                  </Swiper>
                )}
              </Box>
            )}

          </CardContent>
        </Card>
      </Box>

      {/* Create Iban Modal */}
      <CustomModal open={isIbanModalOpen} onClose={handleIbanModalClose} title="Create IBAN Issuance Request">
        <form onSubmit={handleIbanCreate} className="activate-form">
            <CustomInput
                type="text"
                value={ibanCurrency}
                disabled
                label="currency"
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
            <CustomButton className="form-submit-btn" type="submit" style={{ marginTop: 16 }}>
            Create
            </CustomButton>
            </Box>
        </form>
      </CustomModal>

      <CustomModal open={isPayinModalOpen} onClose={handlePayinClose} title="Payin" >
        <form onSubmit={handlePayinSubmit} className="activate-form">

            <CustomInput type="text" value={payinAccount} onChange={e => setPayinAccount(e.target.value)} label="Account" required />
            
            <CustomInput type="text" value={payinFromCurrency} onChange={e => setPayinFromCurrency(e.target.value)} label="From Currency" required />
            
            <CustomInput type="text" value={payinToCurrency} onChange={e => setPayinToCurrency(e.target.value)} label="To Currency" required />
            
            <CustomInput type="text" value={payinFromAccount} onChange={e => setPayinFromAccount(e.target.value)} label="From Account" required />
            
            <CustomButton className="form-submit-btn" type="submit" style={{marginTop:18}}> Create Payin </CustomButton>
        </form>
      </CustomModal>

      <CustomModal open={isWithdrawModalOpen} onClose={handleWithdrawClose} title="Withdraw Funds" >
        <form onSubmit={handleWithdrawSubmit} className="activate-form">

          <CustomInput type="text" value={withdrawType} label="Type" disabled/>

          <CustomInput type="text"  value={withdrawCurrency} onChange={e => setWithdrawCurrency(e.target.value)} label="Currency" required />
          <Box sx={{ fontSize: ".60rem", color: "text.gray", margin: "8px 5px 20px 10px" }}>
            <b>NOTE:</b> Currency of the withdrawal in <b>ISO 4217</b> format 
            (e.g., <code>EUR</code> for euro, <code>USD</code> for US dollar, <code>INR</code> for Indian rupee). 
            For IBAN withdrawal, only <b>euro</b> (<code>EUR</code>) is available.
          </Box>
          <CustomInput type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} label="Amount" required/>

          <CustomInput type="text" value={withdrawFromAccount} onChange={e => setWithdrawFromAccount(e.target.value)} label="From Account" required />

          <CustomInput type="text" value={withdrawIban} onChange={e => setWithdrawIban(e.target.value)} label="IBAN" />

          <CustomInput type="text" value={withdrawBic} onChange={e => setWithdrawBic(e.target.value)} label="BIC/Swift Code"  />

          <CustomButton className="form-submit-btn" type="submit" style={{ marginTop: 18 }}>
            Withdraw
          </CustomButton>
        </form>
      </CustomModal>
      
       {/* Direct Exchange Modal Call */}
      <DirectExchangeModal open={isDirectExchangeOpen} onClose={handleExchangeClose} />
       {/*Crypto withdrawal Modal Call */}
      <CryptoWithdrawModal open={isCryptoModalOpen} onClose={handleClose} />

      <SelectCryptoModal open={isCryptoModalOpen} onClose={() => setIsCryptoModalOpen(false)} accounts={fiatAccounts} onSelect={(account) => { setSelectedCrypto(account); const index = fiatAccounts.findIndex( (a) => a.currency === account.currency ); if (index !== -1) setActiveIndex(index); }} />
    </>
  );
};

export default FiatCrypto;
