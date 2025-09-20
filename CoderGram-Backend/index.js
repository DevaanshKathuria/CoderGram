const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Database Connected Successfully!"))
  .catch(err => console.error("❌ Database Connection Error:", err));

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});