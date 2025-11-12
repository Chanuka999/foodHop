import mongoose from "mongoose";

export const connectDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected"))
    .catch((e) => {
      console.log("DB not connected", e);
    });
};
