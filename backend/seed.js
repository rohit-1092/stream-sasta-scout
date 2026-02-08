const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Platform = require('./models/Platform');

dotenv.config();

const platforms = [
  { name: 'Disney+ Hotstar', link: 'https://www.hotstar.com', price: 149, logo: 'https://logodix.com/logo/2012351.png' },
  { name: 'Zee5', link: 'https://www.zee5.com', price: 99, logo: 'https://logodix.com/logo/2012355.png' }
];

const seedDB = async () => {
  console.log('⏳ Connecting to MongoDB...');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connection established. Cleaning old data...');
    
    await Platform.deleteMany({});
    console.log('🧹 Old platforms removed.');

    await Platform.insertMany(platforms);
    console.log('✅ Database Seeded Successfully!');
    
    mongoose.connection.close();
    console.log('🔌 Connection closed safely.');
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    process.exit(1);
  }
};

seedDB();