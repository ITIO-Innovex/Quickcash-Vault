import React, { useState } from 'react';
import {
  Typography,
  FormControl,
  Select,
  MenuItem,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import EditCardForm from './EditForm';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomModal from '@/components/CustomModal';
import GenericTable from '@/components/common/genericTable';

// --- Dummy data array ---
const dummyCards = [
  {
    _id: '1',
    createdAt: '2024-04-01T10:30:00.000Z',
    name: 'My Visa Card',
    cardNumber: '1234567890123456',
    currency: 'USD',
    cvv: '123',
    expiry: '12/27',
    status: true,
  },
  {
    _id: '2',
    createdAt: '2024-02-11T15:00:00.000Z',
    name: 'Work MasterCard',
    cardNumber: '9876543210987654',
    currency: 'EUR',
    cvv: '321',
    expiry: '03/26',
    status: false,
  },
];

const CardList = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  // Use local state to update table if needed
  const [cardData, setCardData] = useState(dummyCards);

  // ---- DUMMY versions of handlers ----
  const getCardDetails = (id) => {
    const card = cardData.find(c => c._id === id);
    if (card) {
      setSelectedCard({
        id: card._id,
        createdDate: card.createdAt,
        name: card.name,
        cardNumber: card.cardNumber,
        currency: card.currency || "USD",
        cvv: card.cvv,
        expiryDate: card.expiry,
        status: card.status ? 'ACTIVE' : 'INACTIVE',
      });
      setModalOpen(true);
    } else {
      toast.error("Card not found (dummy data)");
    }
  };

  const deleteCard = (id) => {
    if (!window.confirm("Want to delete?")) return;
    setCardData(prev => prev.filter(card => card._id !== id));
    toast.success("Card deleted (dummy mode)");
  };

  // Save handler to update dummy list
  const handleSave = (updatedCard) => {
    setCardData(prev =>
      prev.map(card =>
        card._id === updatedCard.id
          ? {
              ...card,
              name: updatedCard.name,
              cardNumber: updatedCard.cardNumber,
              expiry: updatedCard.expiryDate,
              cvv: updatedCard.cvv,
              currency: updatedCard.currency,
              status: updatedCard.status === 'ACTIVE',
            }
          : card
      )
    );
    setModalOpen(false);
    toast.success("Card updated (dummy mode)");
  };

  const getCurrencyColor = (currency) => {
    const map = {
      INR: 'primary',
      GBP: 'success',
      USD: 'secondary',
      AUD: 'warning',
      EUR: 'error',
    };
    return map[currency] || 'primary';
  };

  const formatCardNumber = (cardNumber) =>
    cardNumber.replace(/(.{4})/g, '$1 ').trim();

  const columns = [
    { id: 'createdDate', label: 'Created Date' },
    { id: 'name', label: 'Name' },
    { id: 'cardNumber', label: 'Card Number' },
    { id: 'currency', label: 'Currency' },
    { id: 'cvv', label: 'CVV' },
    { id: 'expiryDate', label: 'Expiry Date' },
    { id: 'status', label: 'Status' },
    { id: 'action', label: 'Action', align: 'center' },
  ];

  const transformedColumns = columns.map((col) => {
    if (col.id === 'status') {
      return {
        field: col.id,
        headerName: col.label,
        render: (row) => {
          const statusText = row.status ? 'Active' : 'Inactive';
          const statusClass = row.status ? 'active' : 'inactive';
          return (
            <span className={`status-chip ${statusClass}`}>{statusText}</span>
          );
        },
      };
    }
    if (col.id === 'action') {
      return {
        field: col.id,
        headerName: col.label,
        align: 'center',
        render: (row) => (
          <Box display="flex" gap={1}>
            <VisibilityIcon fontSize="small" sx={{ cursor: 'pointer' }} onClick={() => getCardDetails(row.action)} />
            <DeleteIcon fontSize="small" sx={{ cursor: 'pointer' }} onClick={() => deleteCard(row.action)} />
          </Box>
        ),
      };
    }
    return {
      field: col.id,
      headerName: col.label,
    };
  });

  // Array for the table
  const rows = cardData.map(card => ({
    id: card._id,
    createdDate: new Date(card.createdAt).toLocaleDateString(),
    name: card.name,
    cardNumber: (
      <Typography fontFamily="monospace">
        {formatCardNumber(card.cardNumber)}
      </Typography>
    ),
    currency: (
      <Chip label={card.currency || 'USD'} color={getCurrencyColor(card.currency)} />
    ),
    cvv: card.cvv,
    expiryDate: card.expiry,
    status: card.status,
    action: card._id,
  }));

  return (
    <Box sx={{ padding: 3, backgroundColor: theme.palette.background.default }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Card List</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">Rows per page:</Typography>
          <FormControl size="small">
            <Select
              value={rowsPerPage.toString()}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            >
              {[5, 10, 20].map((count) => (
                <MenuItem key={count} value={count}>{count}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2">
            {`${page * rowsPerPage + 1}–${Math.min((page + 1) * rowsPerPage, rows.length)} of ${rows.length}`}
          </Typography>
        </Box>
      </Box>

      <GenericTable
        columns={transformedColumns}
        data={rows}
      />

      {isModalOpen && selectedCard && (
        <CustomModal
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Edit Card"
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <EditCardForm
            card={selectedCard}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        </CustomModal>
      )}
    </Box>
  );
};

export default CardList;
