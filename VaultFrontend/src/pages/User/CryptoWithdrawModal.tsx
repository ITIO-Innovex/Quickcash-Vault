// CryptoWithdrawModal.jsx
import api from "@/helpers/apiHelper";
import React, { useState } from "react";
import { useAppToast } from "@/utils/Toast";
import CustomModal from "@/components/CustomModal";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInputField";
import { Box } from "@mui/material";
const url = import.meta.env.VITE_NODE_ENV === 'production' ? 'api' : 'api';

const CryptoWithdrawModal = ({ open, onClose }) => {
  const toast = useAppToast();

  // Modal fields
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [to, setTo] = useState("");
  const [blockchain, setBlockchain] = useState("");

  // Type: CRYPTO
  const type = "CRYPTO";

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found in localStorage");
        return;
      }

      const res = await api.post(
        `${url}/operation/withdraw`,
        {
          type,
          currency,
          amount,
          fromAccount,
          to,
          blockchain,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Crypto withdrawal Response', res.data);
      toast.success("Crypto withdrawal successful!");
      onClose();
      // Reset fields if needed
      setCurrency("");
      setAmount("");
      setFromAccount("");
      setTo("");
      setBlockchain("");
    } catch (err) {
      let errorMsg = "Something went wrong!";
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMsg = err.response.data.errors[0].description;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
    }
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Crypto Withdrawal">
      <form onSubmit={handleSubmit} className="activate-form">
        <CustomInput type="text" value={type} label="Type" disabled />

        <CustomInput type="text" value={currency} onChange={e => setCurrency(e.target.value)} label="Currency" required />
        <Box sx={{ fontSize: ".60rem", color: "text.gray", margin: "8px 5px 20px 10px" }}>
                    <b>NOTE:</b> Currency of the withdrawal in <b>ISO 4217</b> format 
                    (e.g., <code>EUR</code> for euro, <code>USD</code> for US dollar, <code>INR</code> for Indian rupee). 
                    For IBAN withdrawal, only <b>euro</b> (<code>EUR</code>) is available.
                  </Box>
        <CustomInput type="number" value={amount} onChange={e => setAmount(e.target.value)} label="Amount" required />

        <CustomInput type="text" value={fromAccount} onChange={e => setFromAccount(e.target.value)} label="From Account"required/>

        <CustomInput type="text" value={to} onChange={e => setTo(e.target.value)} label="To Address"  required />

        <CustomInput type="text" value={blockchain} onChange={e => setBlockchain(e.target.value)} label="Blockchain"/>

        <CustomButton className="form-submit-btn" type="submit" style={{ marginTop: 18 }}>
          Withdraw
        </CustomButton>
      </form>
    </CustomModal>
  );
};

export default CryptoWithdrawModal;
