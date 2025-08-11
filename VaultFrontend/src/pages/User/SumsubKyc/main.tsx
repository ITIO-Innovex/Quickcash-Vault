import axios from "axios";
import snsWebSdk from "@sumsub/websdk";
import { useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const SumsubKYC = () => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [kycApiResponse, setKycApiResponse] = useState<any>(null);
  const [accessToken, setAccessToken] = useState(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchAccessToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/kyc/sumsub/token`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data.token;
    } catch (error) {
      console.error("Failed to fetch Sumsub token", error);
      return null;
    }
  };

  const getNewAccessToken = () => fetchAccessToken();

  const updateKycStatus = async (payload:any) => {
    try {
      console.log("KYC Status Payload Sent to Backend:", payload);
      const response = await axios.post(
        `${API_URL}/kyc/kyc-status`,
        payload,
        { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
        console.log("Backend Response:", response.data);
      // If success, start countdown
      if(payload.reviewStatus =="completed"){
        if (response.status === 200 && response.data?.status === 200) {
          setCountdown(5); 
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Handle countdown and redirect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      navigate("/all-plans");
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);
  

  useEffect(() => {
    const initializeSDK = async () => {
      const token = await fetchAccessToken();
      if (!token) return;

      setAccessToken(token);

      const snsWebSdkInstance = snsWebSdk
        .init(token, getNewAccessToken)
        .withConf({
          lang: "en",
          theme: "light",
          
        })
        .withOptions({
          addViewportTag: false,
          adaptIframeHeight: true,
        })
        .on("idCheck.onInitialized", (payload) => {
          console.log("KYC Initializing", payload);
        })
        .on("idCheck.onStepCompleted", (payload) => {
          console.log("Step Completed:", payload);
        })
        .on("idCheck.applicantStatus", (payload) => {
          console.log("KYC Application Status", payload);
        })
        .on("idCheck.onApplicantStatusChanged", (payload) => {
          console.log("KYC Status Change", payload);
          updateKycStatus(payload);
        })
        .on("idCheck.onError", (error) => {
          console.error("SDK Error:", error);
        })
        .build();

      snsWebSdkInstance.launch("#sumsub-websdk-container");
    };

    initializeSDK();
  }, []);

return (
  <div>
    <div
      id="sumsub-websdk-container"
      ref={containerRef}
      style={{ height: "auto" }}
    />
    
    {kycApiResponse && (
      <pre style={{ marginTop: "20px", textAlign: "center", color: "blue" }}>
        {JSON.stringify(kycApiResponse, null, 2)}
      </pre>
    )}

    {countdown !== null && (
      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "18px", color: "green" }}>
        KYC Verified. Redirecting to Subscription Plans in {countdown} second{countdown !== 1 ? "s" : ""}...
      </div>
    )}
  </div>
);
};

export default SumsubKYC;
