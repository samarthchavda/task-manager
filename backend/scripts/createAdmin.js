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
    console.log('Connected to MongoDB');

    const email = 'admin@gmail.com';
    const password = 'admin';

    let user = await User.findOne({ email });
    if (user) {
      user.name = 'Admin';
      user.password = password; // pre-save hook will hash
      user.role = 'Admin';
      await user.save();
      console.log('Updated existing user to admin:', email);
    } else {
      user = new User({ name: 'Admin', email, password, role: 'Admin' });
      await user.save();
      console.log('Created admin user:', email);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

run();
