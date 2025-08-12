import api from "@/helpers/apiHelper";
import { useEffect, useState } from "react";
import { useAppToast } from "@/utils/Toast";
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CustomModal from "@/components/CustomModal";
import DeleteIcon from '@mui/icons-material/Delete';
import CustomButton from "@/components/CustomButton";
import PinDropIcon from '@mui/icons-material/PinDrop';
import CustomInput from "@/components/CustomTextField";
import PageHeader from "@/components/common/pageHeader";
import CommonTooltip from "@/components/common/toolTip";
import GenericTable from "@/components/common/genericTable";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import  InvoicePayment from "../../../../modal/invoiePaymentModal";
const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";
import { Box,CircularProgress, IconButton, Typography, useTheme } from "@mui/material";
import CardOffers from "./availableCardOffers";

const CardRequests = () => {
  const theme = useTheme();
  const toast = useAppToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cardholderName, setCardholderName] = useState('');
  const [setNameLoading, setSetNameLoading] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [billing, setBilling] = useState({ country: "", city: "", addressLine1: "", addressLine2: "", state: "", postalCode: "",});
  const [delivery, setDelivery] = useState({country: "", city: "", addressLine1: "", addressLine2: "", state: "", postalCode: "", firstName: "", lastName: "", phone: "", dialCode: "",});
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payLoading, setPayLoading] = useState(null);
  const [invoice, setInvoice] = useState<any>(null);

  const columns = [
  { field: 'id', headerName: 'Request ID' },
  { field: 'status',
      headerName: 'Status',
      render: (row) => (
        <span className={`status-chip ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
  { field: 'cardType', headerName: 'Card Type' },
  {
    field: 'cardholderName',
    headerName: 'CardHolder Name',
    render: (row) =>
      row.cardholderName ? (
        <Typography fontWeight={500}>{row.cardholderName}</Typography>
      ) : (
        <CommonTooltip title="Set Cardholder Name">
          <span>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleOpenSetName(row)}
              disabled={setNameLoading === row.id}
            >
              {setNameLoading === row.id
                ? <CircularProgress size={20} />
                : <EditIcon />}
            </IconButton>
          </span>
        </CommonTooltip>
      ),
  },
  {
    field: 'cardDesign',
    headerName: 'Design',
    render: (row) =>
      row.cardDesign ? (
        <Typography fontWeight={600}> {row.cardDesign.name.replace(/^ALLA_GORBUNOVA_SA_/, '')}</Typography>
      ) : '-'
  },
  {
    field: 'color',
    headerName: 'Color',
    render: (row) =>
      row.cardDesign && row.cardDesign.color ? (
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              bgcolor: row.cardDesign.color.hexValue,
              border: '1.5px solid #ddd',
              mr: 0.5,
            }}
          />
          {row.cardDesign.color.name}
        </Box>
      ) : '-'
  },
  {
    field: 'currentPriceAmount',
    headerName: 'Price',
    render: (row) => (
      <Typography>
        {row.currentPriceAmount} {row.currentPriceCurrency}
      </Typography>
    ),
  },
  { field: 'invoiceId', headerName: 'Invoice ID' },

//   {
//   field: 'addressAction',
//   headerName: 'Set Address',
//   render: (row) => (
//     <CommonTooltip title="Set Card Address">
//       <span>
//         <IconButton
//           color="secondary"
//           onClick={() => handleOpenAddressModal(row)}
//           size="small"
//         >
//           <PinDropIcon />
//         </IconButton>
//       </span>
//     </CommonTooltip>
//   ),
// },
{
  field: 'actions',
  headerName: 'Actions',
  render: (row) => (
    <Box display="flex" alignItems="center" gap={1}>
      {/* 1. Set Address Icon */}
      <CommonTooltip title="Set Card Address">
        <span>
         <IconButton
          color="secondary"
          onClick={() => handleOpenAddressModal(row)}
          size="small"
        >
          <PinDropIcon />
        </IconButton>
        </span>
      </CommonTooltip>
      {/* 2. Pay Invoice Icon */}
      <CommonTooltip title="Pay Invoice">
        <span>
          <IconButton
            color="success"
            onClick={() => handlePayInvoice(row)}
            disabled={payLoading === row.id}
            size="small"
          >
            {payLoading === row.id
              ? <CircularProgress size={20} />
              : <AttachMoneyIcon />}
          </IconButton>
        </span>
      </CommonTooltip>
      {/* 3. Delete Icon */}
      <CommonTooltip title="Delete this request">
        <span>
          <IconButton
            color="error"
            onClick={() => handleDeleteRequest(row)}
            disabled={deleteLoading === row.id}
          >
            {deleteLoading === row.id
              ? <CircularProgress size={20} />
              : <DeleteIcon />}
          </IconButton>
        </span>
      </CommonTooltip>
    </Box>
  ),
}

];

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`${url}/card/requests`, {
        });
        console.log('API RESPONSE',response.data)
        const arr = Array.isArray(response.data) ? response.data : response.data.data || [];
        setRequestData(arr);
      } catch (error) {
        setRequestData([]);
        console.error("Card Requests API error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleDeleteRequest = async (row) => {
  setDeleteLoading(row.id);
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`${url}/card/delete/${row.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Delete Response:",response);
    if (response.status === 200) {
      toast.success(response.data?.message || "Request deleted successfully.");
      setRequestData(prev => prev.filter((req) => req.id !== row.id));
       setTimeout(() => {
        navigate("/cards");
      }, 600);
    } else {
      toast.error(response.data?.message || "Failed to delete request.");
    }
  } catch (error) {
    toast.error(
      "Error: " + (error.response?.data?.message || error.message) 
    );
  } finally {
    setDeleteLoading(null);
  }
  };

  const handleOpenSetName = (row) => {
  setSelectedRequest(row);
  setCardholderName(''); // or row's current name if available
  setOpenNameDialog(true);
  };

  const handleCloseSetName = () => {
  setOpenNameDialog(false);
  setSelectedRequest(null);
  };

  const handleSetName = async () => {
  if (!cardholderName.trim()) {
    toast.error('Cardholder name is required!');
    return;
  }
  setSetNameLoading(true);
  try {
    const token = localStorage.getItem("token");
    const payload = {
      cardholderName,
      cardRequestId: selectedRequest.id,
    };
    const response = await api.post(`${url}/card/set-name`, payload, {
    });

   if (response.status === 200) {
    toast.success(response.data?.message || "Name set successfully!");
    setRequestData(prev =>
        prev.map(req =>
        req.id === selectedRequest.id
            ? { ...req, cardholderName: cardholderName }
            : req
        )
    ); 
    handleCloseSetName();
    } else {
      toast.error(response.data?.message || "Failed to set name.");
    }
  } catch (error) {
    toast.error(
      "Error: " + (error.response?.data?.message || error.message) +
      ". Please try again."
    );
  } finally {
    setSetNameLoading(false);
  }
  };

   const handlePayInvoice = async (row) => {
    setLoading(true);
      console.log("Invoice Id passed",row.invoiceId);
      setInvoice(row.invoiceId);
      setOpen(true);
    setLoading(false);
    };
  const handleClose = () => setOpen(false);

  
  // Open modal for this row
const handleOpenAddressModal = (row) => {
  setSelectedRow(row);
  setOpenAddressModal(true);
  setBilling({
    country: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    postalCode: "",
  });
  setDelivery({
    country: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    postalCode: "",
    firstName: "",
    lastName: "",
    phone: "",
    dialCode: "",
  });
};

const handleCloseAddressModal = () => {
  setOpenAddressModal(false);
  setSelectedRow(null);
};

// On form field change:
const handleBillingChange = (e) => setBilling(prev => ({
  ...prev, [e.target.name]: e.target.value
}));
const handleDeliveryChange = (e) => setDelivery(prev => ({
  ...prev, [e.target.name]: e.target.value
}));

  return (
    <Box className="dashboard-container" maxWidth="xl" sx={{ backgroundColor: theme.palette.background.default }}>
      <PageHeader title="Card Requests" />
      <CardOffers />
      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Box mt={3}>
          <GenericTable columns={columns} data={requestData} />
        </Box>
      )}

        {/* Modal for setting name */}
        <CustomModal  open={openNameDialog}  onClose={handleCloseSetName} title="Set Cardholder Name" maxWidth="sm" hideCloseIcon={false} disableBackdropClick={true} >
        <Box sx={{ mt: 1 }}>
            <CustomInput
            label="Enter Full Name"
            value={cardholderName}
            onChange={e => setCardholderName(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <CustomButton onClick={handleCloseSetName} color="inherit" disabled={setNameLoading}>
                Cancel
            </CustomButton>
            <CustomButton
                onClick={handleSetName}
                disabled={setNameLoading || !cardholderName.trim()}
                variant="contained"
                color="primary"
            >
                {setNameLoading ? "Saving..." : "Set Name"}
            </CustomButton>
            </Box>
        </Box>
        </CustomModal>

        {/* Modal for settig Address */}
        <CustomModal open={openAddressModal}onClose={handleCloseAddressModal}title="Set Card Address" maxWidth="md">
            <Box component="form" sx={{ mt: 1 }}>
                {/* Billing Address Fields */}
                <Typography mb={1} fontWeight={700}>Billing Address</Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <CustomInput label="Country (ISO 3-letter)" name="country" value={billing.country} onChange={handleBillingChange} required sx={{ flex: 1 }} />
                <CustomInput label="City" name="city" value={billing.city} onChange={handleBillingChange} required sx={{ flex: 1 }} />
                <CustomInput label="State" name="state" value={billing.state} onChange={handleBillingChange} sx={{ flex: 1 }} />
                <CustomInput label="Postal Code" name="postalCode" value={billing.postalCode} onChange={handleBillingChange} sx={{ flex: 1 }} />
                <CustomInput label="Address Line 1" name="addressLine1" value={billing.addressLine1} onChange={handleBillingChange} required sx={{ flex: 1 }} />
                <CustomInput label="Address Line 2" name="addressLine2" value={billing.addressLine2} onChange={handleBillingChange} required sx={{ flex: 1 }} />
                </Box>
                {/* Delivery Address Fields (OPTIONAL section; Add a checkbox if only for physical cards) */}
                <Typography mt={3} mb={1} fontWeight={700}>Delivery Address (for physical cards)</Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <CustomInput label="Country" name="country" value={delivery.country} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                <CustomInput label="City" name="city" value={delivery.city} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                <CustomInput label="State" name="state" value={delivery.state} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                <CustomInput label="Postal Code" name="postalCode" value={delivery.postalCode} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                <CustomInput label="Address Line 1" name="addressLine1" value={delivery.addressLine1} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                <CustomInput label="Address Line 2" name="addressLine2" value={delivery.addressLine2} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                <CustomInput label="First Name" name="firstName" value={delivery.firstName} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                <CustomInput label="Last Name" name="lastName" value={delivery.lastName} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                <CustomInput label="Phone" name="phone" value={delivery.phone} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                <CustomInput label="Dial Code" name="dialCode" value={delivery.dialCode} onChange={handleDeliveryChange} sx={{ flex: 1 }} />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
                <CustomButton variant="outlined" onClick={handleCloseAddressModal}>Cancel</CustomButton>
                <CustomButton
                    variant="contained"
                    color="primary"
                    onClick={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    try {
                        const token = localStorage.getItem("token");
                        const body = { billing, delivery: Object.values(delivery).some(Boolean) ? delivery : undefined };
                        const resp = await api.post(
                        `/card/${selectedRow.id}/set-address`,  
                        body,
                        { headers: { Authorization: `Bearer ${token}` } }
                        );
                        if (resp.status === 200) {
                        toast.success("Address set!");
                        handleCloseAddressModal();
                        // Optionally: update UI/refresh row
                        } else {
                        toast.error(resp.data?.message || "Failed to set address!");
                        }
                    } catch (err) {
                        const msg = err?.response?.data?.message || err.message;
                        toast.error("Error: " + msg + " OR Please check your data and try again.");
                    } finally {
                        setIsSubmitting(false);
                    }
                    }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </CustomButton>
                </Box>
            </Box>
        </CustomModal>
        
        {/* Modal for Invoice Payment */}
        <InvoicePayment open={open} invoice={invoice} handleClose={handleClose} />

            </Box>
  );
};

export default CardRequests;