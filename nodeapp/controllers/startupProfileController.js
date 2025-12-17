// controllers/StartupProfileController.js

const StartupProfile = require("../models/StartupProfile");
const Messages = require("./ControllerStaticMessages");

exports.addStartupProfile = async (req, res) => {
  try {
    const mentorId = req.body.mentorId ?? req.user?.userId;

    const {
      category,
      description,
      fundingLimit,
      avgEquityExpectation,
      avgEquity,
      targetIndustry,
      preferredStage,
    } = req.body;

    // Prefer avgEquityExpectation if provided; fallback to avgEquity
    const avgEq = avgEquityExpectation ?? avgEquity;

    await StartupProfile.create({
      mentorId,
      category,
      description,
      fundingLimit,
      avgEquityExpectation: avgEq,
      targetIndustry,
      preferredStage,
    });

    res.status(200).json({ message: Messages.SUCCESS_PROFILE_ADDED });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllStartupProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const query =
      search.trim().length > 0
        ? {
            $or: [
              { category: { $regex: search, $options: "i" } },
              { targetIndustry: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          }
        : {};

    const skip = (Number(page) - 1) * Number(limit);

    const profiles = await StartupProfile.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await StartupProfile.countDocuments(query);

    res.status(200).json({
      success: true,
      data: profiles,
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error("getAllStartupProfiles error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStartupProfileById = async (req, res) => {
  try {
    const profile = await StartupProfile.findById(req.params.id);

    if (!profile)
      return res
        .status(404)
        .json({ message: Messages.ERROR_PROFILE_NOT_FOUND });

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStartupProfilesByMentorId = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { page = 1, limit = 5, search = "" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build query with optional search filter
    const query = {
      mentorId,
      ...(search.trim().length > 0 && {
        $or: [
          { category: { $regex: search, $options: "i" } },
          { targetIndustry: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { preferredStage: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const profiles = await StartupProfile.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await StartupProfile.countDocuments(query);

    res.status(200).json({
      success: true,
      data: profiles,
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error("getStartupProfilesByMentorId error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStartupProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.avgEquity) {
      updates.avgEquityExpectation = updates.avgEquity;
      delete updates.avgEquity; // avoid duplicate field
    }

    const updatedProfile = await StartupProfile.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProfile)
      return res
        .status(404)
        .json({ message: Messages.ERROR_PROFILE_NOT_FOUND });

    res.status(200).json({ message: Messages.SUCCESS_PROFILE_UPDATED });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStartupProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await StartupProfile.findByIdAndDelete(id);

    if (!deletedProfile)
      return res
        .status(404)
        .json({ message: Messages.ERROR_PROFILE_NOT_FOUND });

    res.status(200).json({ message: Messages.SUCCESS_PROFILE_DELETED });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPublicStartupProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const query =
      search.trim().length > 0
        ? {
            $or: [
              { category: { $regex: search, $options: "i" } },
              { targetIndustry: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { preferredStage: { $regex: search, $options: "i" } },
            ],
          }
        : {};

    const skip = (Number(page) - 1) * Number(limit);

    const profiles = await StartupProfile.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await StartupProfile.countDocuments(query);

    res.status(200).json({
      success: true,
      data: profiles,
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error("getAllPublicStartupProfiles error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};