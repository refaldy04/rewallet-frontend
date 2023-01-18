import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  active: '',
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    handleClick: (state, action) => {
      state.active = action.payload
    },
  },
})

export const { handleClick } = sidebarSlice.actions

export default sidebarSlice.reducer
