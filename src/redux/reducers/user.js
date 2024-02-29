import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  register,
  createPin,
  changePassword,
  checkEmail,
  resetPassword,
} from "../asyncActions/user";

const initialState = {
  token: null,
  id: null,
  pin: null,
  errorMsg: null,
  successMsg: null,
  isLoading: false,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      return initialState;
    },
    resetMsg: (state) => {
      state.errorMsg = null;
      state.successMsg = null;
    },
  },
  extraReducers: (build) => {
    build.addCase(login.pending, (state) => {
      state.errorMsg = null;
      state.successMsg = null;
      state.isLoading = true;
    });
    build.addCase(login.fulfilled, (state, action) => {
      const token = action.payload?.token;
      const pin = action.payload?.pin;
      const email = action.payload?.email;
      const username = action.payload?.username;
      if (token) {
        state.token = token;
        state.pin = pin;
        state.email = email;
        state.username = username;
      } else {
        state.errorMsg = action.payload?.errorMsg;
        state.successMsg = action.payload?.successMsg;
      }
      state.isLoading = false;
    });

    build.addCase(register.pending, (state) => {
      state.errorMsg = null;
      state.successMsg = null;
    });
    build.addCase(register.fulfilled, (state, action) => {
      state.errorMsg = action.payload?.errorMsg;
      state.successMsg = action.payload?.successMsg;
    });
    build.addCase(createPin.fulfilled, (state, action) => {
      state.pin = action.payload?.result;
    });

    build.addCase(changePassword.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.successMsg = action.payload.message;
        state.errorMsg = null;
        state.id = action.payload.result.id;
      } else {
        state.errorMsg = action.payload;
        state.successMsg = null;
      }
    });

    build.addCase(checkEmail.pending, (state, action) => {
      state.errorMsg = null;
      state.errorMsg = null;
    });

    build.addCase(checkEmail.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.errorMsg = null;
        state.id = action.payload.result.id;
      } else {
        state.errorMsg = action.payload;
      }
    });

    build.addCase(resetPassword.fulfilled, (state, action) => {
      state.successMsg = action.payload.message;
    });
  },
});

export { login };
export const { logout, resetMsg } = auth.actions;
export default auth.reducer;
