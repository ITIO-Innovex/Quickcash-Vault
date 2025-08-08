// DirectExchangeModal.jsx
import api from "@/helpers/apiHelper";
import React, { useState } from "react";
import { useAppToast } from "@/utils/Toast";
import CustomModal from "@/components/CustomModal";
import CustomInput from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";

const DirectExchangeModal = ({ open, onClose }) => {
  const toast = useAppToast();

  // Form state
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  // signedRate object fields
  const [rate, setRate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [signature, setSignature] = useState("");

  // RateRequest nested object
  const [rrFromCurrency, setRrFromCurrency] = useState("");
  const [rrToCurrency, setRrToCurrency] = useState("");
  const [rrAmount, setRrAmount] = useState("");
  const [rrAccount, setRrAccount] = useState("");
  const [rrPartner, setRrPartner] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found in localStorage");
        return;
      }

      const payload = {
        fromAccount,
        toAccount,
        fromCurrency,
        toCurrency,
        fromAmount,
        toAmount,
        signedRate: {
          rateRequest: {
            fromCurrency: rrFromCurrency,
            toCurrency: rrToCurrency,
            amount: rrAmount,
            account: rrAccount,
            partner: rrPartner
          },
          rate,
          validUntil,
          signature
        }
      };

      const res = await api.post("/direct-exchange", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Direct exchange successful!");
      onClose();
      // Optionally reset fields
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
    <CustomModal open={open} onClose={onClose} title="Direct Exchange">
      <form onSubmit={handleSubmit} className="activate-form">
        <CustomInput type="text" value={fromAccount} onChange={e => setFromAccount(e.target.value)} label="From Account" required />
        <CustomInput type="text" value={toAccount} onChange={e => setToAccount(e.target.value)} label="To Account" required />
        <CustomInput type="text" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} label="From Currency" required />
        <CustomInput type="text" value={toCurrency} onChange={e => setToCurrency(e.target.value)} label="To Currency" required />
        <CustomInput type="number" value={fromAmount} onChange={e => setFromAmount(e.target.value)} label="From Amount" required />
        <CustomInput type="number" value={toAmount} onChange={e => setToAmount(e.target.value)} label="To Amount" required />

        <hr style={{ margin: "14px 0" }} />

        <div style={{ fontWeight: 500, color: "#7d2ae8", marginBottom: 6 }}>Signed Rate Details</div>
        <CustomInput type="text" value={rrFromCurrency} onChange={e => setRrFromCurrency(e.target.value)} label="RateRequest: From Currency" required />
        <CustomInput type="text" value={rrToCurrency} onChange={e => setRrToCurrency(e.target.value)} label="RateRequest: To Currency" required />
        <CustomInput type="number" value={rrAmount} onChange={e => setRrAmount(e.target.value)} label="RateRequest: Amount" required />
        <CustomInput type="text" value={rrAccount} onChange={e => setRrAccount(e.target.value)} label="RateRequest: Account" />
        <CustomInput type="text" value={rrPartner} onChange={e => setRrPartner(e.target.value)} label="RateRequest: Partner" />
        <CustomInput type="text" value={rate} onChange={e => setRate(e.target.value)} label="Rate" required />
        <CustomInput type="text" value={validUntil} onChange={e => setValidUntil(e.target.value)} label="Valid Until" required />
        <CustomInput type="text" value={signature} onChange={e => setSignature(e.target.value)} label="Signature" required />

        <CustomButton className="form-submit-btn" type="submit" style={{ marginTop: 18 }}>
          Submit Exchange
        </CustomButton>
      </form>
    </CustomModal>
  );
};

export default DirectExchangeModal;
