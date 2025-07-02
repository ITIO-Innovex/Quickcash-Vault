import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Sell, Wallet } from '@mui/icons-material';
import CustomModal from '@/components/CustomModal';
import { Link, useNavigate } from 'react-router-dom';
import CommonTooltip from '@/components/common/toolTip';
import AddMoneyForm from './dashboardInsideForms/AddMoney';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CurrencyExchangeForm from './dashboardInsideForms/CurrencyExchange';
import SelectCryptoModal from './selectCurrencyModal';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/types/jwt';
import api from '@/helpers/apiHelper';
import { Box, Button,Tooltip, Card, CardContent, Tab, Tabs, Typography, useTheme } from '@mui/material';

const FiatCrypto = () => {
    const theme = useTheme  ();
    const [activeTab, setActiveTab] = useState('Fiat');
    const [activeIndex, setActiveIndex] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
    const [isCurrencyExchnageOpen, setIsCurrencyExchnageOpen] = useState(false);

    const handleAddMoneyOpen = () => setIsAddMoneyOpen(true);
    const handleAddMoneyClose = () => setIsAddMoneyOpen(false);
    const handleCurrencyExchangeOpen = () => setIsCurrencyExchnageOpen(true);
    const handleCurrencyExchangeClose = () => setIsCurrencyExchnageOpen(false);
    const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState({        currency: 'USD',
        account: 'US1000000014',
        balance: '$ 10145.83',
        flag: '../flags/usa.png',
    });

     const navigate = useNavigate();
    const handleClick = () => {
        navigate('/account-section');
    };

      const fiatAccounts = [
        { currency: 'USD', account: 'US1000000014', balance: '$ 10145.828', flag: 'US' },
        { currency: 'INR', account: 'IN1000000015', balance: '484575.926', flag: 'IN' },
        { currency: 'INR', account: 'IN1000000015', balance: '164575.926', flag: 'IN' },
        { currency: 'INR', account: 'IN1000000015', balance: '184575.926', flag: 'IN' },
    ];
    return (
        <>
            <Box>
                <Card>
                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                        <Box className='crypto-section-header' >
                            <Tabs value={activeTab} onChange={handleTabChange}
                                sx={{
                                    minHeight: '48px',
                                    '& .MuiTab-root': { minHeight: '48px' },
                                }}
                            >
                                <Tab label="Fiat"
                                    value="Fiat"
                                    className='label-fiat-crypto'


                                />
                                <Tab
                                    label="Crypto"
                                    value="Crypto"
                                    className='label-fiat-crypto'
                                />
                            </Tabs>

                            <Box className='icon-account' onClick={handleClick}>
                                <AppsIcon fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    <span className='button-text'> Account Section</span>
                                </Typography>
                            </Box>
                        </Box>


                        {activeTab === 'Fiat' && (
                            <Box>
                                {/* Header Section */}
                                <Box className='header-section' sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                                    <Box className='img-section' sx={{ mb: { xs: 1, sm: 0 } }}>
                                        <img src="https://flagsapi.com/US/flat/24.png" alt="USD Flag" className="img-round" />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: '#1f2937' }}>USD Account : $ 10145.83</Typography>
                                        <ExpandMoreIcon sx={{ width: 16, height: 16, color: '#4b5563' }} />
                                    </Box>
                                        <Box className='button-section' sx={{ display: 'flex', gap: 1 }}>
                                        <CommonTooltip title="Easily add funds to your wallet using your debit card or linked bank account for instant access.">
                                        <Button className="custom-button" onClick={handleAddMoneyOpen}>
                                            <AddIcon className='icon-size' />
                                            <span className="button-text">Add money</span>
                                        </Button>
                                        </CommonTooltip>

                                        <CommonTooltip title="Seamlessly convert between multiple currencies with real-time exchange rates and low fees.">
                                        <Button className="custom-button" onClick={handleCurrencyExchangeOpen}>
                                            <CompareArrowsIcon className='icon-size' />
                                            <span className="button-text">Exchange</span>
                                        </Button>
                                        </CommonTooltip>

                                        <CommonTooltip title="Send money instantly to friends, family, or other users—locally or internationally.">
                                        <Button
                                            component={Link}
                                            to="/send-money"
                                            className="custom-button"
                                        >
                                            <SendIcon className="icon-size" />
                                            <span className="button-text">Send</span>
                                        </Button>
                                        </CommonTooltip>
                                        
                                    </Box>


                                </Box>

                                {/* Swiper Slider */}
                                <Swiper
                                    spaceBetween={16}
                                    slidesPerView={1}
                                    pagination={{ clickable: true }}
                                    breakpoints={{
                                        640: {
                                            slidesPerView: 2,
                                            spaceBetween: 20,
                                        },
                                        992: {
                                            slidesPerView: 3,
                                            spaceBetween: 30,
                                        },
                                        1400: {
                                            slidesPerView: 4,
                                            spaceBetween: 30,
                                        },
                                    }}
                                    modules={[Pagination]}
                                    style={{ paddingBottom: '2rem' }}
                                >
                                    {fiatAccounts.map((account, index) => {
                                        const isActive = index === 0;
                                        return (
                                            <SwiperSlide key={index}>
                                                <Card className={`crypto-card ${isActive ? 'active' : 'inactive'}`}>
                                                    <CardContent className='card-content-custom'  >
                                                        <Box className='main-content-section'>
                                                            <img
                                                                src={`https://flagsapi.com/${account.flag}/flat/32.png`}
                                                                alt={`${account.currency} Flag`}
                                                                className="img-round"
                                                            />
                                                            <Typography className={`currency-subtitle ${isActive ? 'active' : ''}`}
                                                                variant="subtitle1"
                                                            >
                                                                {account.currency}
                                                            </Typography>
                                                        </Box>

                                                        <Box className='currency-detail'>
                                                            <Typography variant="body2" sx={{ color: isActive ? '#e5e7eb' : '#4b5563' }}>
                                                                {account.account}
                                                            </Typography>
                                                            <Typography className={`account-balance ${isActive ? 'active' : ''}`} variant="body1">
                                                                {account.balance}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </SwiperSlide>
                                        );
                                    })}

                                      {/* Default Add Currency Card */}
                                    <SwiperSlide key="add-currency-fiat">
                                        <Card
                                            className="card-content-custom add-card"
                                            onClick={handleClick}
                                        >
                                            <CardContent className='add-card-content'>
                                                <AddIcon className='add-icon-currency' />
                                                <Typography variant="subtitle1" className='text-add-currency'>
                                                    Add Currency
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </SwiperSlide>
                                </Swiper>
                            </Box>
                        )}

                        {activeTab === 'Crypto' && (
                            <Box>
                                <Box className='header-section' sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                                    <Box className='img-section' sx={{ mb: { xs: 1, sm: 0 } }}>
                                        <img
                                            src="https://flagsapi.com/US/flat/24.png"
                                            alt="USD Flag"
                                            className="img-round"
                                        />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: '#1f2937' }}>USD Account : $ 10145.83</Typography>
                                        <ExpandMoreIcon sx={{ width: 16, height: 16, color: '#4b5563' }} />
                                    </Box>
                                    <Box className='button-section'>
                                        <Button className='custom-button' >
                                            <Sell className='icon-size' />
                                            <span className='button-text'>Buy/Sell</span>
                                        </Button>
                                        <Button className='custom-button'>
                                            <Wallet className='icon-size' />
                                            <span className='button-text'> Wallet Address</span>
                                        </Button>
                                    </Box>
                                </Box>

                                <Swiper
                                    spaceBetween={16}
                                    slidesPerView={1}
                                    pagination={{ clickable: true }}
                                    breakpoints={{
                                        600: {
                                            slidesPerView: 1,
                                        },
                                        960: {
                                            slidesPerView: 3,
                                        }
                                    }}
                                    modules={[Pagination]}
                                    style={{ paddingBottom: '1.5rem' }}
                                >
                                    {fiatAccounts.map((account, index) => {
                                        const isActive = index === 0;
                                        return (
                                            <SwiperSlide key={index}>
                                                <Card className={`crypto-card ${isActive ? 'active' : 'inactive'}`}>
                                                    <CardContent className='card-content-custom'
                                                    >
                                                        <Box className='main-content-section'>
                                                            <img
                                                                src={`https://flagsapi.com/${account.flag}/flat/32.png`}
                                                                alt={`${account.currency} Flag`}
                                                                className="img-round"
                                                            />
                                                            <Typography className={`currency-subtitle ${isActive ? 'active' : ''}`}
                                                                variant="subtitle1"
                                                            >
                                                                {account.currency}
                                                            </Typography>
                                                        </Box>

                                                        <Box className='currency-detail'>
                                                            <Typography variant="body2" sx={{ color: isActive ? '#e5e7eb' : '#4b5563' }}>
                                                                {account.account}
                                                            </Typography>
                                                            <Typography className={`account-balance ${isActive ? 'active' : ''}`} variant="body1">
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
                        )}
                    </CardContent>
                </Card>
            </Box >
              <CustomModal open={isAddMoneyOpen} onClose={handleAddMoneyClose} title="Add Money" sx={{backgroundColor:theme.palette.background.default, color:theme.palette.text.primary}}>
                <AddMoneyForm onClose={handleAddMoneyClose} />
            </CustomModal>

            <CustomModal open={isCurrencyExchnageOpen} onClose={handleCurrencyExchangeClose} title="Exchange USD Currency" sx={{backgroundColor:theme.palette.background.default, color:theme.palette.text.primary}}>
                <CurrencyExchangeForm onClose={handleCurrencyExchangeClose} />
            </CustomModal>

            <SelectCryptoModal
                open={isCryptoModalOpen}
                onClose={() => setIsCryptoModalOpen(false)}
                accounts={fiatAccounts}
                onSelect={(account) => {
                    setSelectedCrypto(account);
                    const index = fiatAccounts.findIndex((a) => a.currency === account.currency);
                    if (index !== -1) setActiveIndex(index);
                }}
        />
        </>
    )
}

export default FiatCrypto
