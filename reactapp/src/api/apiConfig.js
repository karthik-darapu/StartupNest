// src/api/apiConfig.js

const API_CONFIG = {
    BACKEND_URL: "https://8080-feddfdbcefcbcaaffbcdacdfdabcabfebaccfcccce.premiumproject.examly.io",
  
    ENDPOINTS: {
      LOGIN: "/user/login",
      SIGNUP: "/user/signup",
      STARTUP_PROFILE: {
        GET_ALL: "/startupProfile/getAllStartupProfiles",
        DELETE: (id) => `/startupProfile/deleteStartupProfile/${id}`,
        UPDATE: (id) => `/startupProfile/updateStartupProfile/${id}`,
      },
      STARTUP_SUBMISSION: {
        GET_ALL: "/startupSubmission/getAllStartupSubmissions",
        UPDATE: (id) => `/startupSubmission/updateStartupSubmission/${id}`,
        ADD: "/startupSubmission/addStartupSubmission",
        GET_FILE: (id) => `/startupSubmission/getSubmissionFile/${id}`,
      },
    },
  };
  
  export default API_CONFIG;
  