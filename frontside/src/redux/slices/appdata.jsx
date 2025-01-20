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
    setTag(state, action) {
      state.tag = action.payload;
    },

    addTag(state, action) {
      const newTag = action.payload;
      state.tag.push(newTag);
      state.tag.sort((a, b) => a.name.localeCompare(b.name));
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    addCategory(state, action) {
      const newCategory = action.payload;
      state.category.push(newCategory);
      state.category.sort((a, b) => a.name.localeCompare(b.name));
    },
    setProducts(state, action) {
      state.products = action.payload.products;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },
    addProduct(state, action) {
      const newProduct = action.payload;
      state.products.unshift(newProduct); // Add the new product at the beginning of the array
      console.log(state.products)
    },
    updateProduct(state, action) {
      const updatedProduct = action.payload;
      state.products = state.products.map(product =>
        product.wsCode === updatedProduct.wsCode ? updatedProduct : product
      );
      console.log(state.products)
    },
    delProduct(state, action) {
      const deletedProductId = action.payload;
      state.products = state.products.filter(product =>
        product.wsCode != deletedProductId
      );
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setData(state, action) {
      const payload = action.payload;
      payload.forEach((product) => {
        state.menuData[product.name] = product.products;
      });
    },
  },
});

export const { setTag, addProduct,delProduct, setCategory, addTag, addCategory, setProducts, setLoading, updateProduct } = appdataSlice.actions;
export default appdataSlice.reducer;
