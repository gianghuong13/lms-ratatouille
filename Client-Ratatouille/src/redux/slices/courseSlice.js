import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courseId: null,
};

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setCourseId: (state, action) => {
            state.courseId = action.payload;
        },
        resetCourseId: (state) => {
            state.courseId = null;
        },
    },
});

export const { setCourseId, resetCourseId } = courseSlice.actions;

export default courseSlice.reducer;