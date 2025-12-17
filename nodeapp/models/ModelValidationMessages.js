
const ModelValidationMessages = {
    // USER MODEL MESSAGES
    USER_NAME_REQUIRED: "User Name is required",
    USER_EMAIL_REQUIRED: "Email is required",
    USER_MOBILE_REQUIRED: "Mobile Number is required",
    USER_MOBILE_INVALID: "Enter valid 10-digit number",
    USER_PASSWORD_REQUIRED: "Password is required",
    USER_PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
    USER_ROLE_REQUIRED: "Role is required",
  
    // STARTUP PROFILE MODEL MESSAGES
    PROFILE_MENTOR_ID_REQUIRED: "Mentor ID is required",
    PROFILE_CATEGORY_REQUIRED: "Category is required",
    PROFILE_CATEGORY_MIN_LENGTH: "Category must be at least 2 characters",
    PROFILE_CATEGORY_MAX_LENGTH: "Category cannot exceed 50 characters",
    PROFILE_DESCRIPTION_REQUIRED: "Description is required",
    PROFILE_DESCRIPTION_MIN_LENGTH: "Description must be at least 10 characters",
    PROFILE_FUNDING_LIMIT_REQUIRED: "Funding limit is required",
    PROFILE_FUNDING_LIMIT_MIN: "Funding limit must be greater than 0",
    PROFILE_EQUITY_REQUIRED: "Equity % is required",
    PROFILE_EQUITY_MIN: "Equity % must be greater than 0",
    PROFILE_EQUITY_MAX: "Equity % cannot exceed 100",
    PROFILE_INDUSTRY_REQUIRED: "Industry is required",
    PROFILE_STAGE_REQUIRED: "Stage is required",
  
    // STARTUP SUBMISSION MODEL MESSAGES
    SUBMISSION_USER_ID_REQUIRED: "User ID is required",
    SUBMISSION_USER_NAME_REQUIRED: "User Name is required",
    SUBMISSION_PROFILE_ID_REQUIRED: "Startup Profile ID is required",
    SUBMISSION_DATE_REQUIRED: "Submission Date is required",
    SUBMISSION_MARKET_POTENTIAL_REQUIRED: "Market Potential is required",
    SUBMISSION_LAUNCH_YEAR_REQUIRED: "Launch Year is required",
    SUBMISSION_FUNDING_REQUIRED: "Funding Required is required",
    SUBMISSION_ADDRESS_REQUIRED: "Address is required",
    SUBMISSION_PITCH_DECK_REQUIRED: "Pitch Deck File is required",
  };
  
  module.exports = ModelValidationMessages;