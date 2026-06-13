const mongoose = require('mongoose');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8']);
} catch (e) {
  console.warn('Failed to set DNS servers:', e);
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee-portal');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
