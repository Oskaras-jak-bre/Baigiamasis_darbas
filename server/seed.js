import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DATABASE);
    console.log("Sėkmingai prisijungta prie MongoDB!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Klaida:", error);
    mongoose.connection.close();
  }
};

seedDB();
