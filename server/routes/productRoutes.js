import express from "express";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname),
    ),
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const produktai = await ProductModel.find();
    res.json(produktai);
  } catch (error) {
    res.status(500).json({ message: "Nepavyko gauti produktų" });
  }
});

router.post("/", protect, upload.array("nuotraukos", 3), async (req, res) => {
  try {
    const { pavadinimas, kaina, kategorija, aprasas, virselioIndeksas } =
      req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Būtina įkelti nuotrauką" });
    }

    const user = await UserModel.findById(req.userId);

    let nuotraukuNuorodos = req.files.map(
      (file) =>
        `http://localhost:${process.env.PORT || 5000}/uploads/${file.filename}`,
    );

    const pasirinktasIdx = Number(virselioIndeksas) || 0;
    if (pasirinktasIdx > 0 && pasirinktasIdx < nuotraukuNuorodos.length) {
      const virselioFoto = nuotraukuNuorodos.splice(pasirinktasIdx, 1)[0];
      nuotraukuNuorodos.unshift(virselioFoto);
    }

    const naujaPreke = new ProductModel({
      id: Date.now(),
      pavadinimas,
      kaina: Number(kaina),
      autorius: user.name,
      kategorija,
      aprasas,
      nuotraukos: nuotraukuNuorodos,
    });

    await naujaPreke.save();
    res.status(201).json({ success: true, preke: naujaPreke });
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida įkeliant" });
  }
});

router.put("/:id", protect, upload.array("nuotraukos", 3), async (req, res) => {
  try {
    const product = await ProductModel.findOne({ id: Number(req.params.id) });
    const user = await UserModel.findById(req.userId);

    if (!product) return res.status(404).json({ message: "Kūrinys nerastas" });
    if (product.autorius.toLowerCase() !== user.name.toLowerCase()) {
      return res.status(403).json({ message: "Ne jūsų kūrinys" });
    }

    const {
      pavadinimas,
      kaina,
      aprasas,
      kategorija,
      esamosNuotraukos,
      virselioIndeksas,
    } = req.body;

    let galutinesNuorodos = [];
    if (esamosNuotraukos) {
      galutinesNuorodos =
        typeof esamosNuotraukos === "string"
          ? [esamosNuotraukos]
          : esamosNuotraukos;
    }

    if (req.files && req.files.length > 0) {
      const PORT = process.env.PORT || 5000;
      const naujosNuorodos = req.files.map(
        (file) => `http://localhost:${PORT}/uploads/${file.filename}`,
      );
      galutinesNuorodos = [...galutinesNuorodos, ...naujosNuorodos];
    }

    if (galutinesNuorodos.length > 3) {
      return res
        .status(400)
        .json({ message: "Maksimaliai leidžiamos 3 nuotraukos" });
    }
    if (galutinesNuorodos.length === 0) {
      return res
        .status(400)
        .json({ message: "Būtina palikti bent vieną nuotrauką" });
    }

    const pasirinktasIdx = Number(virselioIndeksas) || 0;
    if (pasirinktasIdx > 0 && pasirinktasIdx < galutinesNuorodos.length) {
      const virselioFoto = galutinesNuorodos.splice(pasirinktasIdx, 1)[0];
      galutinesNuorodos.unshift(virselioFoto);
    }

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id: Number(req.params.id) },
      {
        pavadinimas,
        kaina: Number(kaina),
        aprasas,
        kategorija,
        nuotraukos: galutinesNuorodos,
      },
      { new: true },
    );

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Nepavyko atnaujinti kūrinio" });
  }
});

router.patch("/:id/pirkti", async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id: Number(req.params.id) },
      { isParduotas: true },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Kūrinys nerastas" });
    }

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Serverio klaida atliekant pirkimą" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await ProductModel.findOne({ id: Number(req.params.id) });
    const user = await UserModel.findById(req.userId);
    if (product.autorius.toLowerCase() !== user.name.toLowerCase()) {
      return res.status(403).json({ message: "Ne jūsų kūrinys" });
    }

    await ProductModel.findOneAndDelete({ id: Number(req.params.id) });
    res.json({ success: true, message: "Pašalinta" });
  } catch (error) {
    res.status(500).json({ message: "Nepavyko ištrinti" });
  }
});

export default router;
