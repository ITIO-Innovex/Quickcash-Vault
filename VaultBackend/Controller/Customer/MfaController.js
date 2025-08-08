const axios = require('axios');
const { VAULT_BASE_URL } = require('../../Config/VaultConfig');
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");

module.exports = {
    switchMfaAuthorization : async (req, res) => {
    try {

        // API call to the external endpoint (NO Authorization header!)
        const response = await axios.post(
        `${VAULT_BASE_URL}/reg/mfa/authorization/switch`,
        );

        // Successful response
        return res.status(response.status).json(response.data);

    } catch (error) {
        console.error('Switch MFA Authorization Error:', error?.response?.data || error.message);
        return res.status(error?.response?.status || 500).json({
        status: error?.response?.data?.status || "SERVER_ERROR",
        message: error?.response?.data?.message || "Error in MFA authorization switch",
        errors: error?.response?.data?.errors || [],
        error: error?.message
        });
    }
   },
   confirmMfaSwitch : async (req, res) => {
    try {
        // Extract confirmationCode from request body
        const { confirmationCode } = req.body;

        if (!confirmationCode) {
        return res.status(400).json({
            status: "BAD_REQUEST",
            message: "Missing required parameter: confirmationCode"
        });
        }

        // Prepare payload
        const payload = { confirmationCode };

        // External API call
        const response = await axios.post(
        `${VAULT_BASE_URL}/reg/mfa/authorization/switch/confirm`,
        payload,
        );

        // Forward external API response
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('MFA Switch Confirm Error:', error?.response?.data || error.message);
        return res.status(error?.response?.status || 500).json({
        status: error?.response?.data?.status || "SERVER_ERROR",
        message: error?.response?.data?.message || "Error confirming MFA switch",
        errors: error?.response?.data?.errors || [],
        error: error?.message
        });
    }
    },
}