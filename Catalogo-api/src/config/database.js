import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const connection = await mongoose.connect(
            process.env.MONGODB_URI || "mongodb+srv://nomalinkse_db_user:m6Bwjo12I3oX30ug@cluster0.tdv2maj.mongodb.net/catalogo?appName=Cluster0"
        );
        isConnected = true;
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

export default connectDB;