import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: null, // Trạng thái ban đầu
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload; // Cập nhật role
    },
    clearRole: (state) => {
      state.role = null; // Xóa role khi logout
    },
  },
});

export const { setRole, clearRole } = authSlice.actions; // Export actions để sử dụng

export default authSlice.reducer; // Export reducer để thêm vào store
