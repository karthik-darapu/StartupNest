
const mongoose = require("mongoose");
const Messages = require("./ModelValidationMessages");

const startupSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, Messages.SUBMISSION_USER_ID_REQUIRED],
  },
  userName: {
    type: String,
    required: [true, Messages.SUBMISSION_USER_NAME_REQUIRED],
  },
  startupProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StartupProfile",
    required: [true, Messages.SUBMISSION_PROFILE_ID_REQUIRED],
  },
  submissionDate: {
    type: Date,
    required: [true, Messages.SUBMISSION_DATE_REQUIRED],
  },
  marketPotential: {
    type: Number,
    required: [true, Messages.SUBMISSION_MARKET_POTENTIAL_REQUIRED],
  },
  launchYear: {
    type: Date,
    required: [true, Messages.SUBMISSION_LAUNCH_YEAR_REQUIRED],
  },
  expectedFunding: {
    type: Number,
    required: [true, Messages.SUBMISSION_FUNDING_REQUIRED],
  },
  status: {
    type: Number,
    required: true,
    default: 1, // 1 = Submitted, 2 = Shortlisted, 3 = Rejected
  },
  address: {
    type: String,
    required: [true, Messages.SUBMISSION_ADDRESS_REQUIRED],
  },
  pitchDeckFile: {
    type: String,
    required: [true, Messages.SUBMISSION_PITCH_DECK_REQUIRED],
  },
});

const StartupSubmission = mongoose.model(
  "StartupSubmission",
  startupSubmissionSchema
);

module.exports = StartupSubmission;