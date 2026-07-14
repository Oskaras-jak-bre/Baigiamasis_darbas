import express from "express";
import UserModel from "../models/UserModel.js";
import { protect } from "../middleware/authMiddleware.js";
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

router.get("/", async (req, res) => {
  try {
    const naudotojai = await UserModel.find({});
    res.json(naudotojai);
  } catch (error) {
    res.status(500).json({ message: "Klaida" });
  }
});

router.get("/savaites-menininkas", async (req, res) => {
  try {
    const visiVartotojai = await UserModel.find({});

    if (visiVartotojai.length === 0) {
      return res
        .status(404)
        .json({ message: "Sistemoje nėra užregistruotų menininkų" });
    }

    const dabartinėData = new Date();
    const pirmaMetųDiena = new Date(dabartinėData.getFullYear(), 0, 1);
    const praėjusiosDienos = Math.floor(
      (dabartinėData - pirmaMetųDiena) / (24 * 60 * 60 * 1000),
    );
    const savaitesNumeris = Math.ceil(
      (praėjusiosDienos + pirmaMetųDiena.getDay() + 1) / 7,
    );

    const indeksas = savaitesNumeris % visiVartotojai.length;
    const savaitesMenininkas = visiVartotojai[indeksas];

    res.json(savaitesMenininkas);
  } catch (error) {
    res.status(500).json({ message: "Nepavyko gauti savaitės menininko" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { vardas } = req.query;
    if (!vardas)
      return res.status(400).json({ message: "Nenurodytas paieškos žodis" });

    const naudotojas = await UserModel.findOne({
      name: { $regex: new RegExp(vardas.trim(), "i") },
    });
    if (!naudotojas) return res.status(404).json({ message: "Nerastas" });
    res.json({
      id: naudotojas._id,
      vardas: naudotojas.name,
      zanrai: naudotojas.zanrai || [],
      nuotrauka: naudotojas.profileImage,
      email: naudotojas.email,
      telefonas: naudotojas.telefonas,
    });
  } catch (error) {
    res.status(500).json({ message: "Klaida" });
  }
});

router.put("/:id", protect, upload.single("profileImage"), async (req, res) => {
  try {
    if (req.params.id !== req.userId) {
      return res
        .status(403)
        .json({ message: "Draudžiama redaguoti svetimą profilį" });
    }

    const { name, email, telefonas, zanrai, aprasymas } = req.body;

    let updateData = {
      name,
      email,
      telefonas,
      aprasymas,
    };

    if (zanrai) {
      updateData.zanrai =
        typeof zanrai === "string" ? zanrai.split(",") : zanrai;
    } else {
      updateData.zanrai = [];
    }

    if (req.file) {
      const PORT = process.env.PORT || 5000;
      updateData.profileImage = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Klaida atnaujinant profilį:", error);
    res.status(500).json({ message: "Nepavyko atnaujinti profilio" });
  }
});

export default router;
