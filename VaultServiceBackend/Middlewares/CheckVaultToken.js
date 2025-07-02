const axios = require("axios");
const VaultUser = require("../Models/Customer/authModel");
const {
  VAULT_LOGOUT_URL,
  VAULT_REFRESH_URL,
  partnerId,
} = require("../Config/VaultConfig");

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 min

const checkVaultToken = async (req, res, next) => {
  try {
    const vaultUserId = req.user?.user_vault_id;
    if (!vaultUserId) {
      return res
        .status(401)
        .json({ status: 401, message: "Vault user ID missing in token" });
    }

    const vaultUserDoc = await VaultUser.findOne({ userId: vaultUserId });
    if (!vaultUserDoc) {
      return res
        .status(401)
        .json({ status: 401, message: "Vault user not found" });
    }

    const {
      accessToken,
      refreshToken,
      expiresIn,
      accessTokenExpiresAt,
      refreshTokenCreatedAt,
    } = vaultUserDoc;

    const now = Date.now();

    // ✅ Check access token validity
    if (
      accessTokenExpiresAt &&
      now < new Date(accessTokenExpiresAt).getTime()
    ) {
      req.vaultAccessToken = accessToken;
      return next();
    }

    console.log("🔁 Access token expired. Refreshing...");

    // ❌ Check refresh token expiry
    const refreshTokenExpiry =
      new Date(refreshTokenCreatedAt).getTime() + expiresIn * 1000;
    if (now > refreshTokenExpiry) {
      console.log("❌ Refresh token expired. Logging out user.");
      try {
        await axios.post(
          VAULT_LOGOUT_URL,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } catch (logoutErr) {
        console.warn(
          "⚠️ Vault logout failed:",
          logoutErr?.response?.data || logoutErr.message
        );
      }

      return res
        .status(401)
        .json({ status: 401, message: "Session expired. Please login again." });
    }

    // 🔄 Refresh Access Token
    const response = await axios.post(
      VAULT_REFRESH_URL,
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
          partnerId: parseInt(partnerId),
          grantType: "refresh_token",
        },
      }
    );

    const newAccessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token;
    const newExpiresIn = response.data.expires_in;

    // ✅ Update DB
    vaultUserDoc.accessToken = newAccessToken;
    vaultUserDoc.refreshToken = newRefreshToken;
    vaultUserDoc.expiresIn = newExpiresIn;
    vaultUserDoc.accessTokenExpiresAt = new Date(now + ACCESS_TOKEN_LIFETIME);
    vaultUserDoc.refreshTokenCreatedAt = new Date();

    await vaultUserDoc.save();

    console.log("✅ Vault token refreshed");
    req.vaultAccessToken = newAccessToken;
    next();
  } catch (err) {
    console.error(
      "❌ Vault token middleware error:",
      err?.response?.data || err.message
    );
    return res
      .status(500)
      .json({ status: 500, message: "Vault token middleware error" });
  }
};

module.exports = {checkVaultToken };
