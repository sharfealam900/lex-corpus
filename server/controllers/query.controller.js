import Query from "../models/query.model.js";

// Create a new legal query
export const createQuery = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      subject,
      message,
    } = req.body;

    // Validation
    if (
      !fullname ||
      !email ||
      !phoneNumber ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const query = await Query.create({
      user: req.id,
      fullname,
      email,
      phoneNumber,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Legal query submitted successfully.",
      query,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get logged-in user's queries
export const getMyQueries = async (req, res) => {
  try {
    const queries = await Query.find({
      user: req.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      queries,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all queries (Admin)
export const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find()
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      queries,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update query status (Admin)
export const updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["Pending", "In Progress", "Resolved"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found.",
      });
    }

    query.status = status;

    await query.save();

    return res.status(200).json({
      success: true,
      message: "Query status updated successfully.",
      query,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};