require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const KycRoutes = require('./Routes/Customer/KycRoutes');
const AuthCustomerRoutes = require('./Routes/Customer/AuthRoutes');
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Mongo Error:', err));

// Routes
app.use('/api/kyc',KycRoutes);
app.use('/api/customer', AuthCustomerRoutes);
app.use('/api/wallet', require('./Routes/Customer/WalletRoutes'));
app.use('/api/referral', require('./Routes/Customer/ReferralRoutes'));
app.use('/api/countries', require('./Routes/Customer/CountriesRoutes'));
app.use('/api/subscription', require('./Routes/Customer/SubscriptionRoutes'));

const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
