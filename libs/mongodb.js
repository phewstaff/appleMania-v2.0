import mongoose from "mongoose";

const connnectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to mngdb");
  } catch (error) {
    console.log(error);
  }
};

export default connnectMongoDB;
