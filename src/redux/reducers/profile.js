import { createSlice } from '@reduxjs/toolkit';
import { getProfile, getAllProfile, editProfile } from '../asyncActions/profile';
import { transfer } from '../asyncActions/transfer';
import { topup } from '../asyncActions/topup';
const initialState = {
  data: {},
  users: [],
};

const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build.addCase(getProfile.fulfilled, (state, action) => {
      console.log(action.payload.result);
      state.data = action.payload.result;
    });

    build.addCase(getAllProfile.pending, (state) => {
      state.errorMsg = null;
      state.successMsg = null;
    });

    build.addCase(getAllProfile.fulfilled, (state, action) => {
      const users = action.payload?.result;
      if (users) {
        state.users = users;
      }
      console.log('ini users dari profile reducers', users);
    });

    build.addCase(transfer.fulfilled, (state, action) => {
      console.log('ini dari reducers', action.payload[0].balance);
      state.data.balance = action.payload[0].balance;
    });
    build.addCase(topup.fulfilled, (state, action) => {
      console.log('ini dari reducers', action.payload.balance);
      state.data.balance = action.payload.balance;
    });
    build.addCase(editProfile.fulfilled, (state, action) => {
      console.log('ini dari reducers detelah edit data', action.payload.result);
      state.data = action.payload.result[0];
    });
  },
});

export { getProfile, getAllProfile };
export default profile.reducer;
