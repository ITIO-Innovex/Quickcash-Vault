import { Box, Typography } from '@mui/material';
import GenericTable from '../../../components/common/genericTable';

const cryptoColumns = [
  { field: 'date', headerName: 'Date' },
  { field: 'coin', headerName: 'Coin' },
  { field: 'paymentType', headerName: 'Payment Type' },
  { field: 'coins', headerName: 'No of Coins' },
  { field: 'side', headerName: 'Side' },
  { field: 'amount', headerName: 'Amount' },
  {
    field: 'status',
    headerName: 'Status',
    render: (row: any) => (
      <span className={`status-chip ${row.status.toLowerCase()}`}>
        {row.status}
      </span>
    ),
  },
];

const cryptoData = [
  {
    date: '2025-05-26',
    coin: 'BTC',
    paymentType: 'Bank Transfer',
    coins: 0.005,
    side: 'Buy',
    amount: '$350',
    status: 'Success',
  },
  {
    date: '2025-05-25',
    coin: 'ETH',
    paymentType: 'UPI',
    coins: 0.1,
    side: 'Sell',
    amount: '$220',
    status: 'Pending',
  },
  {
    date: '2025-05-24',
    coin: 'XRP',
    paymentType: 'Card',
    coins: 50,
    side: 'Buy',
    amount: '$75',
    status: 'Failed',
  },
  {
    date: '2025-05-26',
    coin: 'BTC',
    paymentType: 'Bank Transfer',
    coins: 0.005,
    side: 'Buy',
    amount: '$350',
    status: 'Success',
  },
  {
    date: '2025-05-25',
    coin: 'ETH',
    paymentType: 'UPI',
    coins: 0.1,
    side: 'Sell',
    amount: '$220',
    status: 'Pending',
  },
  {
    date: '2025-05-24',
    coin: 'XRP',
    paymentType: 'Card',
    coins: 50,
    side: 'Buy',
    amount: '$75',
    status: 'Failed',
  },
];

const FourthLeftSection = () => {
  return (
    <Box className="dashboard-box third-left-section" mt={4}>
      <Typography variant="h6" gutterBottom>
        Recent Crypto Transactions
      </Typography>
      <GenericTable columns={cryptoColumns} data={cryptoData} />
    </Box>
  );
};

export default FourthLeftSection;
