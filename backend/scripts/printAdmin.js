require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const User = require(path.join(__dirname, '..', 'models', 'User'));

const uri = process.env.MONGO_ATLAS_URI || process.env.MONGO_URI || process.env.MONGOSH_URI;

if (!uri) {
  console.error('No MongoDB URI found in env (MONGO_ATLAS_URI or MONGO_URI or MONGOSH_URI)');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findOne({ email: 'admin@gmail.com' }).select('-password');
    if (!user) {
      console.log('Admin user not found');
    } else {
      console.log(JSON.stringify(user, null, 2));
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
