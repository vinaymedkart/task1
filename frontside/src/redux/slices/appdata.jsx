import { createSlice } from "@reduxjs/toolkit";

// Initial state for appdata
const initialState = {
  tag: [],
  category: [],
  products: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

const appdataSlice = createSlice({
  name: "appdata",
  initialState,

  reducers: {
    // Set tags
    setTag(state, action) {
      state.tag = action.payload;
    },
    // Set categories
    setCategory(state, action) {
      state.category = action.payload;
    },
    // Set products and pagination
    setProducts(state, action) {
      state.products = action.payload.products;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },
    // Set loading state
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setTag, setCategory, setProducts, setLoading } = appdataSlice.actions;
export default appdataSlice.reducer;
