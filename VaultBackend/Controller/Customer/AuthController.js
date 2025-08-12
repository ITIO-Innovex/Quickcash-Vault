const axios = require("axios");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const VaultUser = require("../../Models/Customer/authModel");
const LoginSession = require("../../Models/LoginSessionModel");
const SumsubKYC = require('../../Models/Customer/SumsubKycModel');
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");
const SubscriptionPlan = require ("../../Models/Customer/SubscriptionPlanModel");
const {  VAULT_HEADERS,VAULT_SIGNUP_URL,VAULT_CONFIRM_URL,VAULT_BASE_URL, VAULT_LOGIN_URL, VAULT_LOGOUT_URL,} = require("../../Config/VaultConfig");

const generateOurToken = (userData) => {
  const { _id, user_vault_id, scopes, email } = userData;
  return jwt.sign(
    { _id, user_vault_id, scopes, email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = {
  //  Step 1: Signup with email & password
  registerUser: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    try {
      const vaultResponse = await axios.post(
        VAULT_SIGNUP_URL,
        { email, password },
        { headers: VAULT_HEADERS() }
      );
      console.log('  Vault signup API response:', vaultResponse.data);
      return res.status(200).json({
        message: "Vault signup successful",
        vaultData: vaultResponse.data,
      });
    } catch (err) {
      console.error(
        "❌ Vault Signup Error:",
        err.response?.data || err.message
      );
      return res.status(500).json({
        message: "Vault signup failed",
        error: err.response?.data || err.message,
      });
    }
  },
  //  Step 2: Confirm signup with code & save in DB
  confirmSignup: async (req, res) => {
    const {
      email,
      emailConfirmCode,
      password,
      referralCode,
      termsAndConditionsConfirmed,
      termsAndConditionsVersion,
      userType,
    } = req.body;

    // Basic validations
    if (
      !email ||
      !emailConfirmCode ||
      !password ||
      termsAndConditionsConfirmed !== true ||
      !termsAndConditionsVersion ||
      !userType
    ) {
      return res.status(400).json({
        message: "All fields are required and terms must be accepted.",
      });
    }

    try {
      const vaultResponse = await axios.post(
        VAULT_CONFIRM_URL,
        {
          email,
          emailConfirmCode,
          password,
          referralCode,
          termsAndConditionsConfirmed,
          termsAndConditionsVersion,
          userType,
        },
        {
          headers: VAULT_HEADERS(),
        }
      );
      console.log(' Vault confirm API response:', vaultResponse.data);
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await VaultUser.create({
        email,
        password: hashedPassword,
        accessToken: vaultResponse.data.access_token,
        refreshToken: vaultResponse.data.refresh_token,
        userId: vaultResponse.data.user_id,
        scope: vaultResponse.data.scope,
        expiresIn: vaultResponse.data.expires_in,
      });
      console.log(' User saved to DB:', user);
      return res.status(200).json({
        message: "Signup confirmed and user saved to DB",
        user,
      });
    } catch (err) {
      console.error(
        "❌ Vault Confirm Error:",
        err.response?.data || err.message
      );
      return res.status(500).json({
        message: "Vault signup confirmation failed",
        error: err.response?.data || err.message,
      });
    }
  },
  loginUser: async (req, res) => {
    const {
      email,
      password,
      device = "Unknown",
      platform = "Unknown",
    } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({
          status: 400,
          message: "Email and password are required!",
          data: null,
        });
      }

      // Check active sessions
      const activeSessions = await LoginSession.find({
        email,
        isActiveNow: true,
      });
      if (activeSessions.length >= 5) {
        return res.status(403).json({
          status: 403,
          message:
            "Too many active logins. Please logout from another device first.",
          data: null,
        });
      }

      // Vault login
      const headers = {
        ...VAULT_HEADERS(),
        grantType: "password_email",
      };
      const payload = { email, password };

      const vaultResponse = await axios.post(VAULT_LOGIN_URL, payload, {
        headers,
      });
      const vaultData = vaultResponse.data;

      // Fetch user from DB
      const user = await VaultUser.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found in our system",
          data: null,
        });
      }

      // Update access + refresh token
      user.accessToken = vaultData?.access_token;
      user.refreshToken = vaultData?.refresh_token;
      user.accessTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      user.refreshTokenCreatedAt = new Date();
      await user.save();

      const updatedUser = await VaultUser.findOne({ email });
      // console.log("🧪 User after token update:", {
      //   accessToken: updatedUser?.accessToken,
      //   refreshToken: updatedUser?.refreshToken,
      // });

      // Update login stats
      user.loginCount = (user.loginCount || 0) + 1;
      user.lastLogin = new Date();
      await user.save();

      // console.log("📈 Login count updated:", user.loginCount);

      const sessionId = uuidv4();
      // Generate our token
      const ourToken = generateOurToken({
        _id: user._id,
        user_vault_id: vaultData?.user_id,
        scopes: vaultData?.scope || [],
        email: user.email,
        sessionId,
      });
      console.log(sessionId);

      const existingSession = await LoginSession.findOne({
        user_vault_id: user?.userId,
        email,
        device,
        platform,
        isActiveNow: true,
      });

      if (existingSession) {
        // Update loginTime only if already logged in from same device/platform
        existingSession.loginTime = new Date();
        await existingSession.save();
      } else {
        // Create new session if not already present
        await LoginSession.create({
          sessionId,
          user_vault_id: user?.userId,
          email,
          device,
          platform,
          status: 1,
          isActiveNow: true,
          loginTime: new Date(),
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Login Successful",
        ourToken,
        vaultResponse: vaultData,
        loginSession: LoginSession,
      });
    } catch (error) {
      console.error(
        "❌ Vault login error:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        status: 500,
        message: "Vault login failed",
        error: error.response?.data || error.message,
        data: null,
      });
    }
  },
  getVaultUser : async (req, res) => {
    try {
      const userId = req.user._id;

      // ✅ Step 1: Get Vault token from DB/service
      const getData = await fetchVaultDetails(userId);

      if (!getData) {
        return res.status(401).json({
          status: 401,
          message: "Access Denied: Vault user not found",
          data: null,
        });
      }

      const accessToken = getData.vaultUser.access_token;

      // ✅ Step 2: Call external API with Bearer token
      const response = await axios.get(
        `https://platform-api.sandbox.testessential.net/reg/v1/user/info`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // ✅ Step 3: Return API response
      return res.status(200).json({
        status: 200,
        message: "Vault user info fetched successfully",
        data: response.data,
      });

    } catch (error) {
      console.error("❌ Error in getVaultUserInfo:", error.message);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  changeVaultPassword : async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔐 Get access token
    const userVaultData = await fetchVaultDetails(userId);
    if (!userVaultData) {
      return res.status(401).json({
        status: 401,
        message: "Access Denied: Vault user not found",
        data: null,
      });
    }

    const accessToken = userVaultData.vaultUser.access_token;

    // 📥 Body parameters
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 400,
        message: 'Both oldPassword and newPassword are required.',
      });
    }

    // 🌐 Make API request to Vault
    const response = await axios.post(
      'https://platform-api.sandbox.testessential.net/reg/v1/password/change',
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // ✅ Success
    return res.status(200).json({
      status: 200,
      message: 'Password changed successfully',
      data: response.data,
    });
  } catch (err) {
    console.error('❌ Error changing password:', err.response?.data || err.message);
    return res.status(err.response?.status || 500).json({
      status: err.response?.status || 500,
      message: err.response?.data?.message || 'Internal Server Error',
    });
  }
  },
  changeVaultPasswordConfirm : async (req, res) => {
    try {
      const userId = req.user._id;

      const getData = await fetchVaultDetails(userId); // your own function to get vault data

      if (!getData || !getData.vaultUser || !getData.vaultUser.access_token) {
        return res.status(401).json({
          status: 401,
          message: 'Access Denied: Vault user not found',
          data: null,
        });
      }

      const accessToken = getData.vaultUser.access_token;

      const { oldPassword, newPassword, confirmCode } = req.body;

      if (!oldPassword || !newPassword || !confirmCode) {
        return res.status(400).json({
          status: 400,
          message: 'Missing required fields: oldPassword, newPassword, confirmCode',
          data: null,
        });
      }

      const response = await axios.post(
        'https://platform-api.sandbox.testessential.net/reg/v1/password/change/confirm',
        {
          oldPassword,
          newPassword,
          confirmCode,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.status(200).json({
        status: 200,
        message: 'Vault password change confirmed successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('❌ Vault password confirm error:', error?.response?.data || error.message);
      return res.status(500).json({
        status: 500,
        message: 'Something went wrong while confirming password change',
        error: error?.response?.data || error.message,
      });
    }
  },
  checkKYCStatus: async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }
    // console.log('🔍 Checking KYC for userId:', userId);
    const kycDoc = await SumsubKYC.findOne({ user: userId });
    if (!kycDoc) {
      // Instead of 404, return 200 with status 'not_found'
      return res.status(200).json({
        message: 'No KYC document found for this user',
        status: 'not_found',
      });
    }
    const status = kycDoc?.status || 'unknown';
    console.log(`✅ Found KYC document, status: ${status}`);
    return res.status(200).json({
      message: 'KYC status fetched successfully',
      status,
    });
  } catch (error) {
    console.error('❌ KYC status check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
  },
  resetPassword : async (req, res) => {
  try {
    // User input from frontend ( email)
    const payload = req.body;

    const response = await axios.post(
      `${VAULT_BASE_URL}/reg/v2/password/reset`,
      payload,
      {
        headers: {
          ...VAULT_HEADERS(),
        },
      }
    );

    // Return success response to frontend
    res.status(200).json({
      success: true,
      message: 'Reset password request sent successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('❌ Password Reset Error:', error?.response?.data || error.message);

    res.status(error?.response?.status || 500).json({
      success: false,
      message: 'Failed to reset password',
      error: error?.response?.data || error.message,
    });
  }
  },
  resetPasswordConfirm: async (req, res) => {
  try {
    // 👇 Expected body:
    // {
    //   email: "user@example.com",
    //   confirmCode: "123456"
    // }

    // console.log('📥 Incoming confirm code request:', req.body);

    const response = await axios.post(
      `${VAULT_BASE_URL}/reg/v2/password/reset/confirm`,
      req.body,
      {
        headers: {
          ...VAULT_HEADERS(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Password reset confirmed successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('❌ Password Reset Confirm Error:', error?.response?.data || error.message);

    return res.status(error?.response?.status || 500).json({
      success: false,
      message: 'Failed to confirm password reset',
      error: error?.response?.data || error.message,
    });
  }
  },
  resetPasswordExecute: async (req, res) => {
     // Required fields in req.body: email, newPassword, payload
    try {
      const payload = req.body;

      const response = await axios.post(
        `${VAULT_BASE_URL}/reg/v2/password/reset/execute`,
        payload,
        {
          headers: {
            ...VAULT_HEADERS(),
          },
        }
      );

      res.status(200).json({
        success: true,
        message: 'Password reset executed successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('❌ Password Reset Execute Error:', error?.response?.data || error.message);

      res.status(error?.response?.status || 500).json({
        success: false,
        message: 'Failed to execute password reset',
        error: error?.response?.data || error.message,
      });
    }
  },
  logoutUser: async (req, res) => {
    try {

      const mongoId = req.user?._id; // from our MongoDB
      if (!mongoId) {
        return res.status(400).json({ message: "Invalid user ID in token." });
      }

      // Find user by _id
      const user = await VaultUser.findById(mongoId);
      if (!user || !user.accessToken) {
        return res
          .status(404)
          .json({ message: "User or access token not found." });
      }

      // Vault logout request
      const response = await axios.delete(VAULT_LOGOUT_URL, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      console.log("✅ Vault Logout Success:", response.data);

      return res.status(200).json({
        message: "User successfully logged out from Vault",
        vaultResponse: response.data,
      });
    } catch (err) {
      console.error(
        "❌ Vault Logout Error:",
        err.response?.data || err.message
      );
      return res.status(500).json({
        message: "Logout failed",
        error: err.response?.data || err.message,
      });
    }
  },
  userAllSessions : async (req, res) => {
    console.log('vaultBase url:', VAULT_BASE_URL);
  try {
    const userId = req.user._id;

    const getData = await fetchVaultDetails(userId);

    if (!getData || !getData.vaultUser?.access_token) {
      return res.status(401).json({
        status: 401,
        message: "Vault user not found or missing access token",
        data: null,
      });
    }

    const vaultToken = getData.vaultUser.access_token;

    // 🔥 Now call the external API with this token
    const response = await axios.get(
      `${VAULT_BASE_URL}/reg/user/session`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // ✅ Success Response
    return res.status(200).json({
      status: 200,
      message: "Vault session created successfully",
      data: response.data,
    });

  } catch (error) {
    console.error('❌ Vault API error:', error?.response?.data || error.message);

    return res.status(500).json({
      status: 500,
      message: "Failed to create vault session",
      error: error?.response?.data || error.message,
    });
  }
  },
  fetchSubscriptionDetails: async (req,res) =>{
    try{
      const userId = req.user?._id;
      console.log("User Id from fetch Subs route",userId);
        if(!userId){
          return res.status(401).json({
            status:401,
            message:"User Id Missing in request"
          })
        }

      const userSubs = await SubscriptionPlan.find({ userId: new mongoose.Types.ObjectId(userId) });
        console.log("UserSubs query result:", userSubs);

        if (!userSubs || userSubs.length === 0) {
          return res.status(404).json({
            status: 404,
            message: "No subscription plans found for user",
          });
        }
        const description = userSubs.map(plan => plan.subscriptionDetails?.description || "No Description");

        return res.status(200).json({
          status:200,
          message:"Subscription details found for user",
          subscriptionDetails: userSubs.map(plan => ({
            id: plan._id,
            name: plan.subscriptionDetails?.name,
            description: plan.subscriptionDetails?.description,
            paymentStatus: plan.lastPaymentInvoiceStatus,
            status: plan.status
          }))
        })
    }catch (error){
        console.error("Subscription API Error: ", error.message)
        return res.status(500).json({
          status:500,
          message:"Server error fetching subscription details"
        })
    }
  },
};