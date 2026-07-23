import Practice from "../models/practice.model.js";

// Create Practice
export const createPractice = async (req, res) => {
  try {
    const practice = await Practice.create(req.body);

    res.status(201).json({
      success: true,
      message: "Practice created successfully.",
      practice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Practices
export const getPractices = async (req, res) => {
  try {
    const practices = await Practice.find({
      isActive: true,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      practices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Practice
export const updatePractice = async (req, res) => {
  try {
    const practice = await Practice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Practice updated successfully.",
      practice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Practice
export const deletePractice = async (req, res) => {
  try {
    await Practice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Practice deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};