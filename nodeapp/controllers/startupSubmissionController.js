
const StartupSubmission = require("../models/StartupSubmission");
const StartupProfile = require("../models/StartupProfile");
const Messages = require("./ControllerStaticMessages");

exports.addStartupSubmission = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const userName = req.user?.userName;

    const {
      startupProfileId,
      submissionDate,
      marketPotential,
      launchYear,
      expectedFunding,
      address,
      pitchDeckFile,
    } = req.body;

    const parsedFunding =
      expectedFunding && !isNaN(Number(expectedFunding))
        ? Number(expectedFunding)
        : expectedFunding;

    const newSubmission = await StartupSubmission.create({
      userId,
      userName,
      startupProfileId,
      submissionDate,
      marketPotential,
      launchYear,
      expectedFunding: parsedFunding,
      address,
      pitchDeckFile,
      status: 1,
    });

    await StartupProfile.findByIdAndUpdate(startupProfileId, {
      $set: { isSubmitted: true },
    });

    return res.status(200).json({
      message: Messages.SUCCESS_SUBMISSION_ADDED,
      data: newSubmission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllStartupSubmissions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = -1,
      search = "",
      status = "All",
    } = req.query;

    const mentorId = req.user?.userId;
    const query = {};

    if (status !== "All") {
      const statusMap = { Submitted: 1, Shortlisted: 2, Rejected: 3 };
      query.status = statusMap[status];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortObj = { [sort]: Number(order) || -1 };

    const mentorProfiles = await StartupProfile.find({ mentorId }).select("_id");
    const mentorProfileIds = mentorProfiles.map((p) => p._id);
    query.startupProfileId = { $in: mentorProfileIds };

    let submissions = await StartupSubmission.find(query)
      .populate("userId", "userName")
      .populate(
        "startupProfileId",
        "category targetIndustry description fundingLimit avgEquityExpectation preferredStage createdAt"
      )
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    if (search.trim()) {
      const lower = search.toLowerCase();
      submissions = submissions.filter((s) => {
        const category = s.startupProfileId?.category?.toLowerCase() || "";
        const name =
          s.userId?.userName?.toLowerCase() ||
          s.userName?.toLowerCase() ||
          "";
        return category.includes(lower) || name.includes(lower);
      });
    }

    const totalCount = await StartupSubmission.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: submissions,
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStartupSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await StartupSubmission.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: Messages.ERROR_SUBMISSION_NOT_FOUND });

    return res
      .status(200)
      .json({ message: Messages.SUCCESS_SUBMISSION_DELETED });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStartupSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await StartupSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: Messages.ERROR_SUBMISSION_NOT_FOUND });

    return res
      .status(200)
      .json({ message: Messages.SUCCESS_SUBMISSION_UPDATED });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSubmissionFile = async (req, res) => {
  try {
    const submission = await StartupSubmission.findById(req.params.id);
    if (!submission)
      return res.status(404).json({ message: Messages.ERROR_SUBMISSION_NOT_FOUND });

    const fileField = submission.pitchDeckFile;
    if (!fileField)
      return res
        .status(404)
        .json({ message: Messages.ERROR_NO_PITCH_DECK });

    const matches = String(fileField).match(/^data:(.+);base64,(.*)$/);
    const mime = matches ? matches[1] : "application/pdf";
    const b64Data = matches ? matches[2] : fileField;
    const buffer = Buffer.from(b64Data, "base64");

    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Content-Disposition", 'inline; filename="pitchdeck.pdf"');
    return res.send(buffer);
  } catch (error) {
    return res
      .status(500)
      .json({ message: Messages.ERROR_PITCH_DECK_RETRIEVAL });
  }
};

exports.getSubmissionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 2, search = "" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let submissions = await StartupSubmission.find({ userId })
      .populate(
        "startupProfileId",
        "category targetIndustry description fundingLimit avgEquityExpectation preferredStage createdAt"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    if (search.trim()) {
      const lower = search.toLowerCase();
      submissions = submissions.filter((sub) =>
        sub.startupProfileId?.category?.toLowerCase().includes(lower)
      );
    }

    const totalCount = await StartupSubmission.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: submissions,
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStartupSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await StartupSubmission.findById(id)
      .populate("userId", "userName")
      .populate(
        "startupProfileId",
        "category targetIndustry description fundingLimit avgEquityExpectation preferredStage createdAt"
      );

    if (!submission)
      return res.status(404).json({ message: Messages.ERROR_SUBMISSION_NOT_FOUND });

    return res.status(200).json({ success: true, data: submission });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};