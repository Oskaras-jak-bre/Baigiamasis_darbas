import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  pavadinimas: { type: String, required: true },
  kaina: { type: Number, required: true },
  autorius: { type: String, required: true },
  kategorija: { type: String, required: true },
  aprasas: { type: String, required: true },
  nuotraukos: { type: [String], required: true },
  isParduotas: { type: Boolean, default: false },
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
