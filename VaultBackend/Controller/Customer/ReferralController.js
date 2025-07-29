const axios = require('axios');
const { VAULT_HEADERS, VAULT_BASE_URL } = require('../../Config/VaultConfig');

module.exports = {
  validateReferralCode: async (req, res) => {
    try {
      const { code } = req.body;

      const vaultResponse = await axios.post(
        `${VAULT_BASE_URL}/reg/referral/code/validate`,
        { code },
        { headers: VAULT_HEADERS() }
      );

      return res.status(200).json({
        success: true,
        message: 'Referral code validated successfully',
        data: vaultResponse.data,
      });
    } catch (error) {
      console.error('❌ Referral Code Validation Error:', error?.response?.data || error.message);

      return res.status(error?.response?.status || 500).json({
        success: false,
        message: 'Failed to validate referral code',
        error: error?.response?.data || error.message,
      });
    }
  },
};
