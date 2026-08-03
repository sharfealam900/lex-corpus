import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);

    req.id = decoded.userId;

    console.log("req.id:", req.id);

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default isAuthenticated;