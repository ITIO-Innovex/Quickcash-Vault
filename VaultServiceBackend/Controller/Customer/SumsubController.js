const axios = require("axios");
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");
const {
  VAULT_SUMSUB_TOKEN_URL,
  VAULT_HEADERS,
} = require("../../Config/VaultConfig");

const jwt = require("jsonwebtoken");
const SumsubKyc = require("../../Models/Customer/SumsubKycModel");

module.exports = {
  getSumsubToken: async (req, res) => {
    try {
      const userId = req.user._id;

      const getData = await fetchVaultDetails(userId);

      if (!getData) {
        return res.status(401).json({
          status: 401,
          message: "Access Denied: Vault user not found",
          data: null,
        });
      }

      const accessToken = getData.vaultUser.access_token;

      try {
        //   console.log('📡 Sending request to Sumsub with accessToken...');
        const response = await axios.post(
          VAULT_SUMSUB_TOKEN_URL,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        return res.status(200).json({
          status: 200,
          message: "Sumsub token generated",
          data: response.data,
        });
      } catch (err) {
        console.error(" Sumsub API Error:", err.response?.data || err.message);
        return res.status(502).json({
          status: 502,
          message: "Failed to generate Sumsub token",
          data: null,
        });
      }
    } catch (err) {
      console.error(" Internal Server Error:", err);
      return res.status(500).json({
        status: 500,
        message: "Something went wrong with Vault API",
        data: null,
      });
    }
  },
  updateSumsabKyc: async (req, res) => {
    const {
      attemptCnt,
      attemptId,
      createDate,
      levelName,
      reviewId,
      reviewDate,
      reviewStatus,
      reviewResult,
    } = req.body;

    try {
      const token = req.headers?.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token not provided" });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res
          .status(401)
          .json({ message: "Invalid token", error: err.message });
      }

      const userId = decoded._id;
      console.log("Decoded User ID:", userId);
      const filter = { user: userId };
      console.log(`Attempt Count ${attemptCnt}`);
      const update = {
        user: userId,
        status: reviewStatus,
        attemptCnt,
        attemptId,
        levelName,
        reviewId,
        reviewResult,
        reviewDate: new Date(reviewDate),
        createDate: new Date(createDate),
      };

      const result = await SumsubKyc.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      });
      console.log("MongoDB Update Result:", result);

      if (result) {
        console.log("KYC data saved/updated in DB:", result);
        return res.status(200).json({
          status: 200,
          message: "KYC Update Successfully",
        });
      } else {
        console.log("KYC data NOT saved/updated in DB.");
        return res.status(401).json({
          status: 401,
          message: "Something went wrong",
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
