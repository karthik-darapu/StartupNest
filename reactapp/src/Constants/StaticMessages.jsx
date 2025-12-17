
const StaticMessages = {
    // LOGIN PAGE
    ERROR_EMAIL_REQUIRED: "Email is required",
    ERROR_EMAIL_INVALID: "Please enter a valid email address",
    ERROR_PASSWORD_REQUIRED: "Password is required",
    ERROR_PASSWORD_LENGTH: "Password must be at least 6 characters",
    ERROR_INVALID_CREDENTIALS: "Invalid credentials, please try again.",
    SUCCESS_LOGIN: "Login successful!",

    // SIGNUP PAGE
    ERROR_USERNAME_REQUIRED: "User Name is required",
    ERROR_EMAIL_REQUIRED_SIGNUP: "Email is required",
    ERROR_EMAIL_INVALID_SIGNUP: "Please enter a valid email",
    ERROR_MOBILE_REQUIRED: "Mobile Number is required",
    ERROR_MOBILE_INVALID: "Please enter a valid 10-digit number",
    ERROR_PASSWORD_REQUIRED_SIGNUP: "Password is required",
    ERROR_PASSWORD_LENGTH_SIGNUP: "Password must be at least 6 characters",
    ERROR_CONFIRM_PASSWORD_REQUIRED: "Confirm Password is required",
    ERROR_PASSWORD_MISMATCH: "Passwords do not match",
    ERROR_ROLE_REQUIRED: "Role is required",
    SUCCESS_REGISTRATION: "Registration successful!",
    ERROR_SIGNUP_NETWORK: "Network error. Please try again.",
    ERROR_SIGNUP_FAILED: "Signup failed. Try again.",
    SUCCESS_USER_REGISTRATION_MODAL: "User Registration is Successful!",

    // SUBMIT IDEA
    ERROR_MARKET_POTENTIAL_REQUIRED: "Market Potential is required",
    ERROR_LAUNCH_YEAR_REQUIRED: "Launch Year is required",
    ERROR_FUNDING_REQUIRED: "Funding Amount is required",
    ERROR_FUNDING_NUMBER: "Funding Amount must be a number",
    ERROR_FUNDING_MINIMUM: "Funding Amount must be greater than 0",
    ERROR_ADDRESS_REQUIRED: "Address is required",
    ERROR_PITCH_DECK_REQUIRED: "Pitch Deck File is required",
    ERROR_PDF_FILE: "Please upload a valid PDF file",
    ERROR_PROFILE_MISSING:
        "Startup profile information missing. Please go back and try again.",
    ERROR_SUBMISSION_FAILED: "Submission failed, please try again.",
    SUCCESS_SUBMISSION: "Successfully Submitted!",

    // STARTUP PROFILE FORM
    ERROR_CATEGORY_REQUIRED: "Category is required",
    ERROR_DESCRIPTION_REQUIRED: "Description is required",
    ERROR_DESCRIPTION_LENGTH: "Description must be at least 10 characters",
    ERROR_FUNDING_LIMIT_REQUIRED: "Funding limit is required",
    ERROR_AVG_EQUITY_REQUIRED: "Equity % is required",
    ERROR_INDUSTRY_REQUIRED: "Industry is required",
    ERROR_STAGE_REQUIRED: "Stage is required",
    SUCCESS_PROFILE_UPDATED: "Startup Profile Updated Successfully!",
    SUCCESS_PROFILE_ADDED: "Startup Profile Added Successfully!",
    ERROR_UNEXPECTED: "Unexpected error occurred.",
    // Auth
    ERROR_INVALID_TOKEN: "Invalid or expired token",
    ERROR_AUTH_EXPIRED_DISPATCH: "Error dispatching auth:expired event",

    // Console logs
    LOG_SIGNUP_PAYLOAD: "Signup API payload:",
    LOG_LOGIN_PAYLOAD: "Login API payload:",
    ERROR_FETCH_MENTOR_PROFILES: "Failed to fetch mentor profiles",
    ERROR_FETCH_STARTUP_SUBMISSIONS: "Failed to fetch startup submissions",
    ERROR_UPDATE_SUBMISSION_STATUS: "Failed to update submission status",
    ERROR_ADD_STARTUP_SUBMISSION: "Failed to add startup submission",
    ERROR_GET_SUBMISSION_FILE: "Failed to fetch submission file",
    
    // MY SUBMISSIONS (ERROR/SUCCESS/TOAST MESSAGES)
    ERROR_FETCH_SUBMISSIONS: "Error fetching submissions",
    SUCCESS_SUBMISSION_DELETED: "Submission deleted successfully",
    ERROR_DELETE_SUBMISSION: "Error deleting submission",
    ERROR_DELETE_SUBMISSION_FALLBACK: "Failed to delete submission",
    ERROR_LOAD_PITCH_DECK: "Error loading pitch deck",
    ERROR_PITCH_DECK_LOAD_FAILED: "Could not load the pitch deck.",
    LOADING_PITCH_DECK: "Loading pitch deck...",
    NO_PITCH_DECK_AVAILABLE: "No pitch deck available.",
    EMPTY_NO_SUBMISSIONS: "No submissions found.",
    MSG_CONFIRM_DELETE: "Do you want to delete this submission?",



};



export default StaticMessages;
