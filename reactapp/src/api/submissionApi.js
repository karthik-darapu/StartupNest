import api from "./axiosConfig";
import API_CONFIG from "./apiConfig";
import StaticMessages from "../Constants/StaticMessages";

export const fetchStartupSubmissions = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = -1,
    search = "",
    status = "All",
  } = params;

  try {
    const query = new URLSearchParams({
      page,
      limit,
      sort,
      order,
      search,
      status,
    }).toString();

    const { data } = await api.get(`${API_CONFIG.ENDPOINTS.STARTUP_SUBMISSION.GET_ALL}?${query}`);

    return {
      submissions: Array.isArray(data.data) ? data.data : [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || limit,
    };
  } catch (err) {
    console.error(StaticMessages.ERROR_FETCH_STARTUP_SUBMISSIONS, err);
    return { submissions: [], total: 0, page: 1, limit: 10 };
  }
};

export const updateSubmissionStatus = async (id, status) => {
  try {
    const { data } = await api.put(API_CONFIG.ENDPOINTS.STARTUP_SUBMISSION.UPDATE(id), { status });
    return data;
  } catch (err) {
    console.error(StaticMessages.ERROR_UPDATE_SUBMISSION_STATUS, err);
    throw err;
  }
};

export const addStartupSubmission = async (payload) => {
  try {
    const { data } = await api.post(API_CONFIG.ENDPOINTS.STARTUP_SUBMISSION.ADD, payload);
    return data;
  } catch (err) {
    console.error(StaticMessages.ERROR_ADD_STARTUP_SUBMISSION, err);
    throw err;
  }
};

export const getSubmissionFile = async (id) => {
  try {
    const response = await api.get(API_CONFIG.ENDPOINTS.STARTUP_SUBMISSION.GET_FILE(id), {
      responseType: "arraybuffer",
    });
    return response;
  } catch (err) {
    console.error(StaticMessages.ERROR_GET_SUBMISSION_FILE, err);
    throw err;
  }
};
