import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  zanrai: {
    type: [String],
    default: [],
  },
  telefonas: {
    type: String,
    default: "",
  },
  aprasymas: {
    type: String,
    default: "",
    maxlength: [1000, "Aprašymas negali viršyti 1000 simbolių"],
  },
  isSavaitesMenininkas: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
