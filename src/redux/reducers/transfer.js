import { createSlice } from '@reduxjs/toolkit';
// import { getUsers } from '../asyncActions/transfer';
import { getProfileById } from '../asyncActions/profile';

const initialState = {
  data: {},
  dataTransfer: {},
  dataRecipient: {},
};

const transfer = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    selectUser: (state, action) => {
      state.dataTransfer.recipient_id = action.payload.id;
      state.dataTransfer.picture = action.payload.picture;
    },
    inputAmount: (state, action) => {
      state.dataTransfer.amount = action.payload.amount;
      state.dataTransfer.notes = action.payload.notes;
      state.dataTransfer.time = action.payload.time;
    },
    confirmPin: (state, action) => {
      state.dataTransfer.pin = action.payload;
    },
  },
  extraReducers: (build) => {
   
    build.addCase(getProfileById.fulfilled, (state, action) => {
      state.dataRecipient = action.payload.result;
    });
  },
});

export const { selectUser, inputAmount, confirmPin } = transfer.actions;
export default transfer.reducer;
