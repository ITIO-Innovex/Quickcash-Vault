const jwt = require("jsonwebtoken");

const generateOurToken = (userData) => {
  const { _id, user_vault_id, scopes, email } = userData;

  return jwt.sign(
    {
      _id,
      user_vault_id,
      scopes,
      email
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

module.exports = { generateOurToken };
