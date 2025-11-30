const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/Posts'); 
const usersRoutes = require('./routes/users');
const commentsRoutes = require('./routes/comments');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
const path = require('path');
const cors = require('cors');
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("Database Connected Successfully!"))
  .catch(err => console.error("Database Connection Error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/comments', commentsRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
