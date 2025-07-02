import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CustomButton from '@/components/CustomButton';
import BeneficiaryModal from './beneficeryDetailModal';
import PageHeader from '@/components/common/pageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, InputAdornment, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton,} from '@mui/material';

// Beneficiary interface for type safety
interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
  iban?: string;
  bicCode?: string;
  country: string;
  currency: string;
}

// Bank account interface
interface BankAccount {
  id: string;
  label: string;
  balance: number;
  currency: string;
}

// Static beneficiary data - in real app, this would come from API
const beneficiaries: Recipient[] = [
  { 
    id: '1', 
    name: 'Yash Bagha', 
    accountNumber: 'US1000000014', 
    iban: 'US1000000018', 
    bicCode: 'NATAUU33XXX',
    country: 'United States',
    currency: 'USD'
  },
  { 
    id: '2', 
    name: 'John Smith', 
    accountNumber: 'CA2000000025', 
    iban: 'CA2000000025', 
    bicCode: 'RBCBCATT',
    country: 'Canada',
    currency: 'CAD'
  },
  { 
    id: '3', 
    name: 'Emma Johnson', 
    accountNumber: 'GB3000000036', 
    iban: 'GB3000000036', 
    bicCode: 'BARCGB22',
    country: 'United Kingdom',
    currency: 'GBP'
  },
  { 
    id: '4', 
    name: 'RTSD Bagha', 
    accountNumber: 'IN4000000047', 
    iban: 'IN4000000047', 
    bicCode: 'SBININBB',
    country: 'India',
    currency: 'INR'
  },
  { 
    id: '5', 
    name: 'Maria Garcia', 
    accountNumber: 'ES5000000058', 
    iban: 'ES5000000058', 
    bicCode: 'BBVAESMMXXX',
    country: 'Spain',
    currency: 'EUR'
  },
];

const bankAccounts: BankAccount[] = [
  { id: 'acc1', label: 'USD Account - US1000000014', balance: 5000, currency: 'USD' },
  { id: 'acc2', label: 'EUR Account - EU1234567890', balance: 3000, currency: 'EUR' },
];

// Beneficiary Selection Form Component - Allows users to select existing beneficiaries
const BeneficiarySelectionForm: React.FC = () => {

const [amount, setAmount] = useState('20');
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(bankAccounts[0].id);
  const [currentBeneficiary, setCurrentBeneficiary] = useState<Recipient | null>(null);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);

  const fee = 23;
  const total = parseInt(amount || '0') + fee;
  const youGet = 0;

  const navigate = useNavigate();
  const location = useLocation();
  const returnToSendMoney = location.state?.returnToSendMoney;

  // Filter beneficiaries based on search term (name or account number)
  const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
    beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beneficiary.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (beneficiary.iban && beneficiary.iban.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBeneficiarySelect = (id: string) => {
    const beneficiary = beneficiaries.find(b => b.id === id);
    if (beneficiary && returnToSendMoney) {
      // Navigate back to send money with selected beneficiary and currency stored
      navigate("/send-money", { 
        state: { 
          selectedBeneficiary: {
            id: beneficiary.id,
            name: beneficiary.name,
            accountNumber: beneficiary.accountNumber,
            country: beneficiary.country,
            currency: beneficiary.currency
          }
        } 
      });
    } else {
      // Open modal for other operations
      setSelectedBeneficiaryId(id);
      setCurrentBeneficiary(beneficiary || null);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = () => {
    console.log('Submitted', { currentBeneficiary, amount, selectedAccount, fee, total, youGet });
    setOpenModal(false);
    if (returnToSendMoney) {
      navigate("/send-money");
    }
  };

  const handleBack = () => {
    if (returnToSendMoney) {
      navigate("/send-money");
    } else {
      navigate("/dashboard");
    }
  };

  const handleAddNew = () => {
    navigate("/add-beneficiary");
  };

  return (
    <Box className="recipient-container">
      {/* Header Section - Back button, title, and add new button */}
      <PageHeader title='Select Beneficiary' buttonText='new' onButtonClick={handleAddNew}/>

      {/* Search Bar - Filter beneficiaries by name, account number, or IBAN */}
      <Box className="bene-search-bar" mb={2}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Account Name, Iban"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Recipients List - Display filtered beneficiaries */}
      <Box className="recipient-list-box">
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Recipients ({filteredBeneficiaries.length} found)
        </Typography>
        <List disablePadding>
          {filteredBeneficiaries.map((b) => {
            const isSelected = selectedBeneficiaryId === b.id;
            return (
              <ListItem 
                key={b.id}
                onClick={() => handleBeneficiarySelect(b.id)}
                className={`acoount-list-item ${isSelected ? 'selected' : ''}`}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor:' #5e5d5d' } }}
              >
                <ListItemAvatar>
                  <Avatar>{b.name.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={b.name} 
                  secondary={`${b.accountNumber} • ${b.country} • ${b.currency}`}
                   primaryTypographyProps={{ fontWeight: "bold" }}
                secondaryTypographyProps={{color:'text.gray'}}
                />
              </ListItem>
            );
          })}
          {filteredBeneficiaries.length === 0 && (
            <ListItem>
              <ListItemText 
                primary="No beneficiaries found" 
                secondary="Try adjusting your search or add a new beneficiary"
              />
            </ListItem>
          )}
        </List>
      </Box>

      {/* Beneficiary Details Modal - Shows when a beneficiary is selected */}
      <BeneficiaryModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        beneficiary={currentBeneficiary}
        amount={amount}
        fee={fee}
        total={total}
        youGet={youGet}
        selectedAccount={selectedAccount}
        bankAccounts={bankAccounts}
        onAmountChange={setAmount}
        onAccountChange={setSelectedAccount}
      />
    </Box>
  );
};

export default BeneficiarySelectionForm;
