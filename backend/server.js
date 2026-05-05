const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(express.json());

const CLIENT_URL = process.env.CLIENT_URL || '*';
app.use(cors({ origin: CLIENT_URL }));

// Connect DB
connectDB(process.env.MONGO_ATLAS_URI || process.env.MONGO_URI);

app.get('/', (req, res) => res.send('Team Task Manager API'));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// 404
app.use((req, res, next) => res.status(404).json({ message: 'Not Found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
