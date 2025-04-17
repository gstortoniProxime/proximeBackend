const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
const businessRoutes = require('./routes/businessRoutes');
app.use('/api/businesses', businessRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('[✅ MongoDB] Connected successfully'))
.catch(err => console.error('[❌ MongoDB] Connection error:', err));

app.get('/', (req, res) => {
  res.send('Proxime API is running 🎉');
});

app.listen(port, '0.0.0.0',() => {
  console.log(`[🚀 API] Running on http://localhost:${port}`);
});
