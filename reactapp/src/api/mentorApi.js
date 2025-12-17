import api from "./axiosConfig";
import API_CONFIG from "./apiConfig";
import StaticMessages from "../Constants/StaticMessages";

export const fetchMentorProfiles = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = -1,
    search = "",
  } = params;

  try {
    const query = new URLSearchParams({ page, limit, sort, order, search }).toString();
    const { data } = await api.get(`${API_CONFIG.ENDPOINTS.STARTUP_PROFILE.GET_ALL}?${query}`);

    return {
      profiles: Array.isArray(data.data) ? data.data : [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || limit,
    };
  } catch {
    console.error(StaticMessages.ERROR_FETCH_MENTOR_PROFILES);
    return { profiles: [], total: 0, page: 1, limit: 10 };
  }
};

export const deleteMentorProfile = async (id) => {
  const { data } = await api.delete(API_CONFIG.ENDPOINTS.STARTUP_PROFILE.DELETE(id));
  return data;
};

export const updateMentorProfile = async ({ id, updatedData }) => {
  const { data } = await api.put(API_CONFIG.ENDPOINTS.STARTUP_PROFILE.UPDATE(id), updatedData);
  return data;
};
