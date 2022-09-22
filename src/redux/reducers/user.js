import { createSlice } from '@reduxjs/toolkit';
import { login, register, createPin } from '../asyncActions/user';

const initialState = {
  token: null,
  id: null,
  pin: null,
  errorMsg: null,
  successMsg: null,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // localStorage.removeItem('token');
      return initialState;
    },
  },
  extraReducers: (build) => {
    build.addCase(login.pending, (state) => {
      state.errorMsg = null;
      state.successMsg = null;
    });
    build.addCase(login.fulfilled, (state, action) => {
      console.log('ini dari redicers user', action.payload);
      const token = action.payload?.token;
      const pin = action.payload?.pin;
      const email = action.payload?.email;
      const username = action.payload?.username;
      if (token) {
        state.token = token;
        state.pin = pin;
        state.email = email;
        state.username = username;
        // localStorage.setItem('token', token);
      } else {
        state.errorMsg = action.payload?.errorMsg;
        state.successMsg = action.payload?.successMsg;
      }
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
      console.log('ini dari reducer auth', action.payload);
      state.pin = action.payload?.result;
    });
  },
});

export { login };
export const { logout } = auth.actions;
export default auth.reducer;
