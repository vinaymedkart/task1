import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tag: [],
    category:[]  
};

const appdataSlice = createSlice({
    name: "appdata",
    initialState: initialState,

    reducers: {
        setTag(state, action) {
            state.tag = action.payload;
        },
        setCategory(state, action) {
            state.category = action.payload;
        }
    }
});

export const { setTag,setCategory } = appdataSlice.actions;
export default appdataSlice.reducer;