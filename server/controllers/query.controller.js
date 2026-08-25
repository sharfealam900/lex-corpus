import Query from "../models/query.model.js";
import validator from "validator";

const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 20;
const MAX_PRACTICE_AREA_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export const createQuery = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      practiceArea,
      subject,
      message,
    } = req.body;

    if (
      !fullname ||
      !email ||
      !phoneNumber ||
      !practiceArea ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const cleanFullname = fullname.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhoneNumber = phoneNumber.trim();
    const cleanPracticeArea = practiceArea.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    if (
      cleanFullname.length > MAX_NAME_LENGTH ||
      cleanPhoneNumber.length > MAX_PHONE_LENGTH ||
      cleanPracticeArea.length >
        MAX_PRACTICE_AREA_LENGTH ||
      cleanSubject.length > MAX_SUBJECT_LENGTH ||
      cleanMessage.length > MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields are too long.",
      });
    }

    const query = await Query.create({
      user: req.id,
      fullname: cleanFullname,
      email: cleanEmail,
      phoneNumber: cleanPhoneNumber,
      practiceArea: cleanPracticeArea,
      subject: cleanSubject,
      message: cleanMessage,
    });

    return res.status(201).json({
      success: true,
      message: "Legal query submitted successfully.",
      query: {
        _id: query._id,
        status: query.status,
        createdAt: query.createdAt,
      },
    });
  } catch (error) {
    console.error("Create query error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyQueries = async (req, res) => {
  try {
    const queries = await Query.find({
      user: req.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      queries,
    });
  } catch (error) {
    console.error("Get my queries error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find()
      .populate("user", "fullname email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      queries,
    });
  } catch (error) {
    console.error("Get all queries error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "In Progress",
      "Resolved",
    ];

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
    console.error("Update query status error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};