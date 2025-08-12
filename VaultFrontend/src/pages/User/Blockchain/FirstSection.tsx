import api from '@/helpers/apiHelper';
import { Link, useNavigate } from 'react-router-dom'; // For routing
import React, { useEffect, useState } from 'react';
import CustomModal from '../../../components/CustomModal';
import GenericTable from '@/components/common/genericTable';
import CustomInput from '../../../components/CustomInputField';
import CustomButton from '@/components/CustomButton';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import CommonTooltip from '@/components/common/toolTip';
import { useAppToast } from '@/utils/Toast';
  // Handle Account selection change
import type { SelectChangeEvent } from '@mui/material/Select';

const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const FirstSection = () => {
  const toast = useAppToast(); 
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [formData, setFormData] = useState({
    accountId: '',
    addressIndex: 0,
    blockchain: '',
    currency: '',
  });
  // use to fetch blockchain currencies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token not found in localStorage");
          return;
        }
        // API endpoint as per backend route
        const res = await api.get(`${url}/blockchain/currencies/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // If response has data, process it
        if (res.data && res.data.data) {
          // Ensure that the data is sorted by 'id' in ascending order
          const sortedData = res.data.data.sort((a: any, b: any) => {
            // Ensuring the sorting works correctly
            return a.id - b.id;
          });
          setData(Array.isArray(sortedData) ? sortedData : []);
        } else {
          setData([]);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch blockchain currencies');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Token not found in localStorage');
        return;
      }

      const response = await api.get(`${url}/wallet/all-accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Response from API:', response.data.data);
      if (response.status === 200 && response.data.data.length > 0) {
        setAccounts(response.data.data); // Set the accounts data to state
        toast.success('Wallet accounts fetched successfully!');
      } else {
        setAccounts([]); // No accounts found
        toast.error('No accounts found!');
      }
    } catch (err: any) {
      // Handling 403 error and extracting specific message
      if (err?.response?.status === 403) {
        const errorMessage = err?.response?.data.errors?.[0]?.description || 'No Accounts Found!';
        toast.error(errorMessage);
      } else {
        console.error('Error fetching accounts:', err?.response?.data || err.message);
        toast.error('Failed to fetch wallet accounts!');
      }
    }
  };

    // Handle Account selection change
  const handleAccountChange = (event: SelectChangeEvent<string>) => {
    const selectedAccountId = event.target.value as string;
    setSelectedAccount(selectedAccountId);

    setFormData((prevFormData) => ({
      ...prevFormData,
      accountId: selectedAccountId, // Automatically set accountId
    }));
  };

  const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'custodyName', headerName: 'CustodyName' },
  { field: 'name', headerName: 'Name' },
  { field: 'processor', headerName: 'Processor' },
  { field: 'slug', headerName: 'Slug' },
  {
    field: 'wallet',
    headerName: 'Wallet',
    render: (row: any) => {
      const processorValue = row.processor && row.processor.toUpperCase();
      if (processorValue === 'FIREBLOCKS') {
        return (
          <CommonTooltip title="Create a new wallet for this blockchain">
          <Link to="" onClick={handleOpenModal} style={{ color: 'blue', textDecoration: 'underline',cursor: 'pointer' }}>
            Create Wallet
          </Link>
          </CommonTooltip>
        );
      }
      return null;
    }
  }
];
    // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    // Open modal and fetch accounts
  const handleOpenModal = () => {
    setModalOpen(true);
    fetchAccounts();  // Fetch accounts when modal is opened
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // API call to create wallet
  const createWallet = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    console.log('Token from ls',token);
    if (!token) {
      console.warn('Token not found in localStorage');
      return;
    }

    const response = await api.get(`${url}/wallet/address`, {
      params: {
        accountId: selectedAccount || formData.accountId,
        blockchain: formData.blockchain,
        addressIndex: formData.addressIndex,  // Include addressIndex if filled
        currency: formData.currency,          // Include currency if filled
      },
    });

    if (response.status === 200) {
      // console.log('Wallet created successfully:', response.data);
      toast.success('Wallet created successfully!');
      handleCloseModal();
      navigate('/wallets');  
    }
  } catch (err: any) {
    // Error Handling: Log and show error toast
    console.error('Error creating wallet:', err?.response?.data || err.message);
    toast.error(err?.response?.data?.message || 'Failed to create wallet!');
    setError('Failed to create wallet');
  }
  finally {
      setLoading(false); // Reset loading state after the API call
    }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  // Validation: disable button if any required field is empty or only whitespace
  const isFormValid = (
    formData.accountId && String(formData.accountId).trim() !== '' &&
    formData.blockchain && String(formData.blockchain).trim() !== ''
  );

  return (
    <div>
      <GenericTable columns={columns} data={data} />

      {/* Modal to create wallet */}
      <CustomModal open={isModalOpen} onClose={handleCloseModal} disableBackdropClick={true} title="Create Wallet">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Account Selection Dropdown */}
          <FormControl fullWidth variant="outlined">

            <InputLabel id="select-account-label">Select Account</InputLabel>
            <Select labelId="select-account-label" value={selectedAccount} onChange={handleAccountChange} label="Select Account" required>
              {accounts.length === 0 ? (
                <MenuItem disabled>No accounts available</MenuItem>
              ) : (
                accounts.map((account) => (
                  <MenuItem key={account.account} value={account.account}>
                    {account.account} - {account.accountType} ({account.status})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Account ID field (auto-filled after selection) */}
          <CustomInput label="Account ID" name="accountId" value={formData.accountId} onChange={handleInputChange} required />
          <CustomInput label="Address Index" name="addressIndex" value={formData.addressIndex} onChange={handleInputChange} required />
          <CustomInput label="Blockchain Slug" name="blockchain" value={formData.blockchain} onChange={handleInputChange} required />
          <CustomInput label="Currency" name="currency" value={formData.currency} onChange={handleInputChange} required />
          {/* Show loading spinner on button */}
          <CustomButton onClick={createWallet} variant="contained" color="primary" disabled={!isFormValid || loading}>
            {loading ? <CircularProgress size={24} /> : 'Create Wallet'}
          </CustomButton>
        </Box>
      </CustomModal>
    </div>
  );
};

export default FirstSection;
