
const ControllerStaticMessages = {
    // STARTUP PROFILE MESSAGES
    SUCCESS_PROFILE_ADDED: "Startup profile added successfully",
    SUCCESS_PROFILE_UPDATED: "Startup profile updated successfully",
    SUCCESS_PROFILE_DELETED: "Startup profile deleted successfully",
    ERROR_PROFILE_NOT_FOUND: "Cannot find any startup profile",
  
    // STARTUP SUBMISSION MESSAGES
    SUCCESS_SUBMISSION_ADDED: "Submission added successfully",
    SUCCESS_SUBMISSION_UPDATED: "Submission updated successfully",
    SUCCESS_SUBMISSION_DELETED: "Submission deleted successfully",
    ERROR_SUBMISSION_NOT_FOUND: "Submission not found",
    ERROR_NO_PITCH_DECK: "No pitch deck available for this submission",
    ERROR_PITCH_DECK_RETRIEVAL: "Server error while retrieving pitch deck file",
  
    // USER/AUTH MESSAGES
    SUCCESS_USER_REGISTERED: "User registered successfully",
    SUCCESS_LOGIN: "Login successful",
    ERROR_MISSING_FIELDS: "All required fields must be provided",
    ERROR_USER_EXISTS: "An account with this ${field} already exists.",
    ERROR_DUPLICATE_KEY: "This ${key} is already registered.",
    ERROR_USER_NOT_FOUND: "User not found",
    ERROR_INVALID_CREDENTIALS: "Invalid credentials",
    ERROR_EMAIL_PASSWORD_REQUIRED: "Email and password are required",
  
    // GENERIC ERROR MESSAGES
    ERROR_SERVER: "Server error",
    ERROR_SIGNUP: "Server error during signup",
    ERROR_LOGIN: "Server error during login",
  };
  
  module.exports = ControllerStaticMessages;