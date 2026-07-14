import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "super_slaptas",
      );
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Neautorizuota, blogas tokenas" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Neautorizuota, nerastas tokenas" });
  }
};
