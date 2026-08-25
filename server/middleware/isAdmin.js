import User from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.id)
      .select("_id role")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export default isAdmin;