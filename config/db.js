import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// database connection
const connectDB = async () => {
    try {
        // console.log("DB_URI", process.env.DB_URL);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected…');
    } catch (err) {
        console.error("Error connecting to the database:", err.message);
        throw err;
    }
}

export default connectDB;