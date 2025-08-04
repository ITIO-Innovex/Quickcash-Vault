import api from '@/helpers/apiHelper';
import { useAppToast } from '@/utils/Toast';
import { useEffect, useState } from 'react';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import CommonTooltip from '@/components/common/toolTip';
import { CheckCircle, Lock, AccountBalanceWallet, ContentCopy, Done, VerifiedUser } from '@mui/icons-material';
import { Box, Card, CardContent, Typography, Grid, useTheme, IconButton } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FirstSection = () => {
  const theme = useTheme();
  const toast = useAppToast();
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false); 
  const [openIframe, setOpenIframe] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null); 
  const [addressCopied, setAddressCopied] = useState<boolean>(false);

  // Fetch wallets (stable, no flicker)
  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Token not found in localStorage');
        return;
      }
      const response = await api.get(`${API_URL}/wallet/all-wallets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setWallets(response.data.data);
        // Only show toast if not initial load
        // toast.success('Wallets fetched successfully!');
      } else {
        toast.error('Failed to fetch wallets!');
      }
    } catch (err: any) {
      console.error('Error fetching wallets:', err);
      toast.error('Failed to fetch wallets!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate wallet address
  const handleValidateWallet = async (wallet: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Token not found');
        return;
      }
      const response = await api.get(`${API_URL}/wallet/validate`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          address: wallet.address,
          blockchain: wallet.blockchain,
        },
      });
      if (response.status === 200 && response.data.status === 200) {
        toast.success('Wallet validated successfully!');
        fetchWallets(); // Refresh wallets to get updated valid field
      } else {
        toast.error(response.data.message || 'Validation failed!');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Validation failed!');
    }
  };

 //to top-up wallet 
  const handleTopUpWallet = (walletId: string) => {
    // Open modal when user clicks the "Top-up Wallet" icon
    const wallet = wallets.find((w) => w._id === walletId);
    setSelectedWallet(wallet);
    setOpenModal(true); 
  };

   const handleCopyAddress = () => {
    if (selectedWallet) {
      navigator.clipboard.writeText(selectedWallet.address)
        .then(() => {
          setAddressCopied(true); // Change icon to tick when copied
          toast.success('Wallet address copied successfully!');
        })
        .catch(err => {
          console.error('Failed to copy wallet address:', err);
          toast.error('Failed to copy wallet address');
        });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAddressCopied(false); // Reset the copy state when closing the modal
  };

  const handleTopUpClick = () => {
  // Open the faucet URL in a new window/tab
  window.open('https://cloud.google.com/application/web3/faucet/ethereum/sepolia', '_blank');
};

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {wallets.map((wallet) => (
          <Grid item xs={12} sm={6} md={4} key={wallet._id}>
            <Card className="wallets-card" sx={{backgroundColor:theme.palette.background.gray}}>
              <CardContent>
                <Typography variant="h6" className="wallet-blockchain">{wallet.blockchain.toUpperCase()}</Typography>
                <Typography variant="body2" className="wallet-address">{wallet.address}</Typography>
              </CardContent>
             {/* Tooltip with the Icon */}
              <CommonTooltip title={wallet.valid ? "Wallet is verified" : "Click to validate wallet address"}>
                <span>
                  <IconButton
                    onClick={() => handleValidateWallet(wallet)}
                    className="verify-icon"
                    sx={{ position: 'absolute', bottom: 10, right: 10 }}
                    disabled={wallet.valid}
                  >
                    {wallet.valid ? (
                      <CheckCircle sx={{ color: '#4caf50' }} />
                    ) : (
                      <Lock sx={{ color: '#ccc' }} />
                    )}
                  </IconButton>
                </span>
              </CommonTooltip>

              {/* Top-up Wallet Icon */}
              <CommonTooltip title="NOTE: Top-up your wallet to continue using it for payments.">
                <IconButton
                  onClick={() => handleTopUpWallet(wallet._id)}
                  className="topup-icon"
                  sx={{ position: 'absolute', top: 10, right: 10 }}
                >
                  <AccountBalanceWallet sx={{ color: '#ff9800' }} /> {/* Orange wallet icon */}
                </IconButton>
              </CommonTooltip>
            </Card>
          </Grid>
        ))}
      </Grid>
       {/* Custom Modal for Top-up */}
      {selectedWallet && (
        <CustomModal open={openModal} onClose={handleCloseModal} sx={{backgroundColor:theme.palette.background.default}} title="Top-up Your Wallet"  disableBackdropClick={true}>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">Have you copied your wallet address?</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
              <IconButton onClick={handleCopyAddress} sx={{ marginRight: 2 }}>
                {addressCopied ? (
                  <Done sx={{ color: '#4caf50' }} /> // Tick icon when copied
                ) : (
                  <ContentCopy sx={{ color: theme.palette.text.primary }} /> // Copy icon
                )}
              </IconButton>
              <Typography variant="body2" sx={{color: theme.palette.text.primary}}>{selectedWallet.address}</Typography>
            </Box>
            <CustomButton color="primary" disabled={!addressCopied} sx={{ marginTop: 3 }} onClick={handleTopUpClick}> Top-up Wallet</CustomButton>
          </Box>
        </CustomModal>
      )}

    </Box>
  );
};

export default FirstSection;
