import { Box, Card, CardContent, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface Account {
  currency: string;
  account: string;
  balance: string;
  flag: string;
}

interface SelectCryptoModalProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  onSelect: (account: Account) => void;
}

const SelectCryptoModal = ({ open, onClose, accounts, onSelect }: SelectCryptoModalProps) => {
  if (!open) return null;

  return (
    <Box
      sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1300, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, }}
      onClick={onClose}
    >
      <Box
        sx={{ bgcolor: '#fff', borderRadius: 2, width: { xs: '90%', sm: 500 }, maxHeight: '80vh', overflowY: 'auto', p: 2, }} onClick={(e) => e.stopPropagation()}  >
        <Typography variant="h6" mb={2}>Select Crypto Account</Typography>

        <Swiper spaceBetween={16} slidesPerView={1} pagination={{ clickable: true }} modules={[Pagination]} breakpoints={{ 600: { slidesPerView: 2 }, 900: { slidesPerView: 3 }, }} style={{ paddingBottom: '1rem' }} >
          
          {accounts.map((account, index) => (
            <SwiperSlide key={index}>
              <Card
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  onSelect(account);
                  onClose();
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={account.flag}
                    alt={`${account.currency} Flag`}
                    width={32}
                    height={32}
                    style={{ borderRadius: '50%', marginBottom: 8 }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {account.currency}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                    {account.balance}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default SelectCryptoModal;
