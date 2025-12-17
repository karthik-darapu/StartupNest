
const mongoose = require('mongoose');
const Messages = require('./ModelValidationMessages');

const startupProfileSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, Messages.PROFILE_MENTOR_ID_REQUIRED]
  },
  category: {
    type: String,
    required: [true, Messages.PROFILE_CATEGORY_REQUIRED],
    trim: true,
    minlength: [2, Messages.PROFILE_CATEGORY_MIN_LENGTH],
    maxlength: [50, Messages.PROFILE_CATEGORY_MAX_LENGTH],
    index: true
  },
  description: {
    type: String,
    required: [true, Messages.PROFILE_DESCRIPTION_REQUIRED],
    trim: true,
    minlength: [10, Messages.PROFILE_DESCRIPTION_MIN_LENGTH]
  },
  fundingLimit: {
    type: Number,
    required: [true, Messages.PROFILE_FUNDING_LIMIT_REQUIRED],
    min: [1, Messages.PROFILE_FUNDING_LIMIT_MIN]
  },
  avgEquityExpectation: {
    type: Number,
    required: [true, Messages.PROFILE_EQUITY_REQUIRED],
    min: [1, Messages.PROFILE_EQUITY_MIN],
    max: [100, Messages.PROFILE_EQUITY_MAX]
  },
  targetIndustry: {
    type: String,
    required: [true, Messages.PROFILE_INDUSTRY_REQUIRED],
    trim: true
  },
  preferredStage: {
    type: String,
    required: [true, Messages.PROFILE_STAGE_REQUIRED],
    enum: ['idea', 'MVP', 'pre-revenue', 'scaling', 'established']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

startupProfileSchema.index({ category: 1 });
startupProfileSchema.index({ mentorId: 1 });

const StartupProfile = mongoose.model('StartupProfile', startupProfileSchema);

module.exports = StartupProfile;