import { createSlice } from "@reduxjs/toolkit";

// Initial state for appdata
const initialState = {
  tag: [],
  category: [],
  products: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  cartData:{}
};

const appdataSlice = createSlice({
  name: "appdata",
  initialState,

  reducers: {
    setTag(state, action) {
      state.tag = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload.products;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
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
    addToCart(state, action) {
      const productName = action.payload.product.name;
      const productPrice = action.payload.product.price;
      const productImages = action.payload.product.images;
      // console.log(productImages)
      if (state.cartData[productName]) {

        state.cartData[productName].quantity++;
      } else {

        state.cartData[productName] = {
          quantity: 1,
          price: productPrice,
          images:productImages
        };
      }
    },
    removeFromCart(state, action) {
      const productName = action.payload.product.name;

      if (state.cartData[productName]) {
        if (state.cartData[productName].quantity > 1) {

          state.cartData[productName].quantity--;
        } else {

          delete state.cartData[productName];
        }
      }
    },
  },
});

export const { setTag, setCategory, setProducts, setLoading } = appdataSlice.actions;
export default appdataSlice.reducer;
