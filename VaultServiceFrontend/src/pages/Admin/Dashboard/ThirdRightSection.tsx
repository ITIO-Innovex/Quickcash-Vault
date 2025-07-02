import { Box, Typography } from '@mui/material';
import GenericTable from '../../../components/common/genericTable'; 

const columns = [
  { field: 'date', headerName: 'Date' },
  { field: 'trx', headerName: 'Trx ID' },
  { field: 'type', headerName: 'Type' },
  { field: 'amount', headerName: 'Amount' },
  {
    field: 'status',
    headerName: 'Status',
    render: (row: any) => (
      <span
        className={`status-chip ${
          row.status === 'Success'
            ? 'success'
            : row.status === 'Pending'
              ? 'pending'
              : 'failed'
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

const data = [
  {
    date: '2025-05-20',
    trx: 'TRX123456',
    type: 'Credit',
    amount: '$500.00',
    status: 'Success',
  },
  {
    date: '2025-05-19',
    trx: 'TRX123457',
    type: 'Debit',
    amount: '$150.00',
    status: 'Pending',
  },
  {
    date: '2025-05-18',
    trx: 'TRX123458',
    type: 'Credit',
    amount: '$320.00',
    status: 'Failed',
  },
];

const ThirdRightSection = () => {
  return (
    <Box className="dashboard-box third-section">
      <Typography className="box-title">Recent Transactions</Typography>
      <GenericTable columns={columns} data={data} />
    </Box>
  );
};

export default ThirdRightSection;
