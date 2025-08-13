import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import GenericTable from '@/components/common/genericTable';
import CustomModal from '@/components/CustomModal'; 
import CustomButton from '@/components/CustomButton';
import api from '@/helpers/apiHelper';

const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const FourthSection = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Function to fetch details of a specific transaction by ID
  const fetchTransactionDetails = async (transactionId: string) => {
    try {
      const response = await axios.get(`${url}/wallet/balance-log/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log(`Details for transaction ${transactionId}:`, response.data);

      // Open the modal with the fetched data
      setSelectedTransaction(response.data.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  // Columns for the table
  const transactionColumns = [
    { field: 'timestamp', headerName: 'Date' },
    { 
      field: 'id', 
      headerName: 'ID', 
      render: (row: any) => (
        <span 
          style={{ cursor: 'pointer', color: 'blue' }} 
          onClick={() => fetchTransactionDetails(row.id)} // Now `fetchTransactionDetails` is in scope
        >
          {row.id}
        </span>
      ),
    },
    { field: 'blockchain', headerName: 'Blockchain' },
    { field: 'operationType', headerName: 'Operation Type' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'currency', headerName: 'Currency' },
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

  useEffect(() => {
   const fetchTransactionData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`${url}/wallet/balance-log`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Crypto API Response:', response.data);

    // Mapping the response data to match the table format
    if (response.data && response.data.data) {
      const mappedData = response.data.data.map((item: any) => {
        const amount = item.cryptoDepositModel ? item.cryptoDepositModel.amount : item.subscriptionFeeTransferModel?.amount;
        const blockchain = item.cryptoDepositModel ? item.cryptoDepositModel.blockchain : '';
        const currency = item.cryptoDepositModel ? item.cryptoDepositModel.currency.toUpperCase() : '';
        
        return {
          timestamp: new Date(item.timestamp).toLocaleString(),
          operationType: item.operationType,
          id: item.id,
          amount: amount,
          blockchain: blockchain,
          currency: currency,
          status: item.status,
        };
      });

      setTransactionData(mappedData);
    } else {
      console.error('No data found in response');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

    fetchTransactionData();
  }, []);

  const handleModalClose = () => {
  setModalOpen(false);
  setSelectedTransaction(null);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className="fourth-section-wrapper">
      <Box className="fourth-box">
        <Typography className="box-title">Crypto Transactions</Typography>
        <GenericTable columns={transactionColumns} data={transactionData} />
      </Box>
      {/* Custom Modal to display the transaction details */}
      <CustomModal  title="Transaction Details"  open={modalOpen}  onClose={handleModalClose}  disableBackdropClick={true} >
        {selectedTransaction && (
          <Box padding={3} >

            <Typography variant="body1" mb={1}>
              <strong>Transaction ID:</strong> {selectedTransaction.id}
            </Typography>
            <Typography variant="body1" mb={1}>
              <strong>Operation Type:</strong> {selectedTransaction.operationType}
            </Typography>
            <Typography variant="body1" mb={1}>
              <strong>Status:</strong> 
              <span className={`status-chip ${selectedTransaction.status.toLowerCase()}`}>
                {selectedTransaction.status}
              </span>
            </Typography>
            {selectedTransaction.cryptoDepositModel ? (
            <>
              <Typography variant="body1" mb={1}>
                <strong>Blockchain:</strong> {selectedTransaction.cryptoDepositModel.blockchain}
              </Typography>
              <Typography variant="body1" mb={1}>
              <strong>Amount:</strong> {selectedTransaction.cryptoDepositModel.amount} {selectedTransaction.cryptoDepositModel.currency.toUpperCase()}
            </Typography>
              <Typography variant="body1" mb={1}>
                <strong>From Address:</strong> {selectedTransaction.cryptoDepositModel.fromAddress}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>To Address:</strong> {selectedTransaction.cryptoDepositModel.toAddress}
              </Typography>
              <Typography variant="body1" mb={2}>
                <strong>Transaction Hash:</strong> {selectedTransaction.cryptoDepositModel.txHash}
              </Typography>
            </>
          ) : (
            // Handle case where `subscriptionFeeTransferModel` is available
            <>
              <Typography variant="body1" mb={1}>
                <strong>Amount:</strong> {selectedTransaction.subscriptionFeeTransferModel.amount} {selectedTransaction.subscriptionFeeTransferModel.currency.toUpperCase()}
              </Typography>
            </>
          )}

          <Box display="flex" justifyContent="flex-end">
            <CustomButton variant="contained" color="primary" onClick={handleModalClose}>
              Close
            </CustomButton>
          </Box>
        </Box>
      )}
      </CustomModal>
    </Box>
  );
};

export default FourthSection;
