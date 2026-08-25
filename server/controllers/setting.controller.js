import Setting from "../models/setting.model.js";

const allowedFields = [
  "websiteName",
  "tagline",
  "logo",
  "aboutTitle",
  "aboutHeading",
  "aboutDescription",
  "aboutMission",
  "aboutVision",
  "aboutImage",
  "aboutExperience",
  "aboutCasesWon",
  "aboutHappyClients",
  "aboutExpertLawyers",
  "favicon",
  "contactEmail",
  "phone",
  "whatsapp",
  "address",
  "googleMap",
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
  "heroTitle",
  "heroSubtitle",
  "heroButtonText",
  "heroButtonLink",
  "metaTitle",
  "metaDescription",
  "metaKeywords",
];

export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne().lean();

    if (!settings) {
      settings = await Setting.create({});
      settings = settings.toObject();
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings.",
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const settings = await Setting.findOneAndUpdate(
      {},
      {
        $set: updateData,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update settings.",
    });
  }
};