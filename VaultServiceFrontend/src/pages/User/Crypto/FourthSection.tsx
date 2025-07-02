import GenericTable from '@/components/common/genericTable';
import { Box, Typography } from '@mui/material';

const transactionData = [
  {
    date: "2025-04-14 05:35:52 PM",
    coin: "USDT_BSC",
    quantity: "5.0007451",
    type: "buy",
    amount: "$5",
    status: "Pending",
  },
  {
    date: "2025-04-09 11:06:39 AM",
    coin: "USDT_BSC",
    quantity: "5.0040984",
    type: "buy",
    amount: "$5",
    status: "Failed",
  },
  {
    date: "2025-04-09 05:54:32 PM",
    coin: "ADA",
    quantity: "8.9605735",
    type: "buy",
    amount: "$5",
    status: "Success",
  },
  {
    date: "2025-04-08 04:42:01 PM",
    coin: "ADA",
    quantity: "16.9376694",
    type: "buy",
    amount: "$10",
    status: "Success",
  },
  {
    date: "2025-04-08 01:35:14 PM",
    coin: "ADA",
    quantity: "8.5587128",
    type: "buy",
    amount: "$5",
    status: "Success",
  },
];

const transactionColumns = [
  { field: "date", headerName: "Date" },
  { field: "coin", headerName: "Coin" },
  { field: "quantity", headerName: "Quantity" },
  { field: "type", headerName: "Type" },
  { field: "amount", headerName: "Amount" },
  {
    field: "status",
    headerName: "Status",
    render: (row: any) => (
      <span className={`status-chip ${row.status.toLowerCase()}`}>
        {row.status}
      </span>
    ),
  },
];

const FourthSection = () => {
  return (
    <Box className="fourth-section-wrapper">
      <Box className="fourth-box">
        <Typography className="box-title">Crypto Transactions</Typography>
        <GenericTable columns={transactionColumns} data={transactionData} />
      </Box>
    </Box>
  );
};

export default FourthSection;
