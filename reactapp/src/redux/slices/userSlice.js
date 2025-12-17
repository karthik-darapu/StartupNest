import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: localStorage.getItem("userId") || null,
  userName: localStorage.getItem("userName") || null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userId, userName, role, token } = action.payload;
      state.userId = userId;
      state.userName = userName;
      state.role = role;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
    },

    clearUser: (state) => {
      state.userId = null;
      state.userName = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
