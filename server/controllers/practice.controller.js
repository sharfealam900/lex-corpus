import Practice from "../models/practice.model.js";

export const createPractice = async (req, res) => {
  try {
    const {
      title,
      description,
      icon,
      order,
      isActive,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    const practice = await Practice.create({
      title: title.trim(),
      description: description.trim(),
      icon,
      order,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Practice created successfully.",
      practice,
    });
  } catch (error) {
    console.error("Create practice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create practice.",
    });
  }
};

export const getPractices = async (req, res) => {
  try {
    const practices = await Practice.find({
      isActive: true,
    })
      .sort({ order: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: practices.length,
      practices,
    });
  } catch (error) {
    console.error("Get practices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch practices.",
    });
  }
};

export const updatePractice = async (req, res) => {
  try {
    const {
      title,
      description,
      icon,
      order,
      isActive,
    } = req.body;

    const updateData = {
      title,
      description,
      icon,
      order,
      isActive,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    if (typeof updateData.title === "string") {
      updateData.title = updateData.title.trim();
    }

    if (typeof updateData.description === "string") {
      updateData.description =
        updateData.description.trim();
    }

    const practice = await Practice.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!practice) {
      return res.status(404).json({
        success: false,
        message: "Practice not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Practice updated successfully.",
      practice,
    });
  } catch (error) {
    console.error("Update practice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update practice.",
    });
  }
};

export const deletePractice = async (req, res) => {
  try {
    const practice = await Practice.findById(
      req.params.id
    );

    if (!practice) {
      return res.status(404).json({
        success: false,
        message: "Practice not found.",
      });
    }

    await Practice.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Practice deleted successfully.",
    });
  } catch (error) {
    console.error("Delete practice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete practice.",
    });
  }
};