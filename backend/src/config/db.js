import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI);

    console.log(`DB is Connected to database: ${connection.connection.host}`);
  } catch (error) {
    console.log('Error in DB connection:', error.message);
    process.exit(1);
  }
};