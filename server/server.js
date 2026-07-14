import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { authRoutes } from "./routes/auth.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import UserModel from "./models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_DATABASE)
  .then(() => console.log("Sėkmingai prisijungta prie MongoDB!"))
  .catch((error) => console.error("MongoDB prisijungimo klaida", error));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Neteisingi duomenys" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Neteisingi duomenys" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "super_slaptas",
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        vardas: user.name,
        email: user.email,
        profileImage: user.profileImage,
        telefonas: user.telefonas || "",
        zanrai: user.zanrai || [],
        aprasymas: user.aprasymas || "",
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Klaida prisijungiant" });
  }
});

app.get("/", (req, res) => res.send("Serveris veikia švariai!"));

app.listen(PORT, () =>
  console.log(`Serveris paleistas adresu: http://localhost:${PORT}`),
);
