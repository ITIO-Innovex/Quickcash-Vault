const VaultUser = require('../Models/Customer/authModel');

const fetchVaultDetails = async (userId) => {
  try {

    const vaultUser = await VaultUser.findById(userId);

    if (!vaultUser) {
      return null;
    }

    return {
      vaultUser: {
        access_token: vaultUser.accessToken,
        refresh_token: vaultUser.refreshToken,
        vault_user_id: vaultUser.userId,
      }
    };
  } catch (err) {
    console.error(" Error in fetchVaultDetails:", err);
    return null;
  }
};

module.exports = { fetchVaultDetails };
