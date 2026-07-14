import express from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import multer from "multer";
import path from "path";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, password, zanrai, aprasymas, telefonas } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: `Prašome užpildyti visus laukelius` });
    }
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: `Vartotojas su šiuo el. paštu jau egzistuoja` });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let zanruMasyvas = [];
    if (zanrai) {
      zanruMasyvas = typeof zanrai === "string" ? zanrai.split(",") : zanrai;
    }
    let profileImageUrl = "";
    if (req.file) {
      profileImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const newUser = new UserModel({
      name,
      email,
      telefonas: telefonas || "",
      password: hashedPassword,
      profileImage: profileImageUrl,
      zanrai: zanruMasyvas || "",
      aprasymas: aprasymas || "",
      isSavaitesMenininkas: false,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Registracija sėkminga. Dabar galite prisijungti" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Serverio klaida registracijos metu" });
  }
});

export { router as authRoutes };
