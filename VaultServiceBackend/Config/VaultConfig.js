require('dotenv').config();
const VAULT_BASE_URL = process.env.VAULT_BASE_URL;
const partnerId = process.env.PARTNER_ID;

const VAULT_HEADERS = () => ({
  'Content-Type': 'application/json',
  partnerId: parseInt(partnerId) //  convert to number if needed
});

module.exports = {
  VAULT_SIGNUP_URL: `${VAULT_BASE_URL}/reg/v1/signup`,
  VAULT_CONFIRM_URL: `${VAULT_BASE_URL}/reg/v1/signup/confirm`,
  VAULT_LOGIN_URL : `${VAULT_BASE_URL}/reg/v1/auth/token`,
  VAULT_LOGOUT_URL : `${VAULT_BASE_URL}/reg/user/session/logout/current`,
  VAULT_SUMSUB_TOKEN_URL :`${VAULT_BASE_URL}/reg/v1/verification/sumsub/token`,
  VAULT_SUBSCRIPTION_URL: `${VAULT_BASE_URL}/reg/subscription`,
  VAULT_WALLET_URL: `${VAULT_BASE_URL}/wallet`,
  VAULT_REFRESH_URL: `${VAULT_BASE_URL}/reg/v1/auth/token`,
  VAULT_BASE_URL,
  partnerId,
  VAULT_HEADERS
};
