import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Sign in
    signInStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Sign out
    signOut: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
    },

    // Update user
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
    },

    // Update token
    updateToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOut,
  updateUserSuccess,
  updateToken,
} = userSlice.actions;

export default userSlice.reducer;