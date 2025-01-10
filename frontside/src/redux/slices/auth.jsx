import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signupData: null,
    loading: false,
    token: localStorage.getItem('token') || null,
    order:[]
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, action) {
            state.signupData = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setToken(state, action) {
            state.token = action.payload;
        },
        setOrderData(state,action){
            // console.log(action.payload)
            state.order=action.payload
        }
    },
});

export const { setSignupData, setLoading, setToken,setOrderData } = authSlice.actions;
export default authSlice.reducer;