import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartData: {}, 
    loading: false,
    customerToken: localStorage.getItem("customerToken") || null
};

const customerSlice = createSlice({
    name: "customer",
    initialState: initialState,
    reducers: {
        setData(state, action) {
            // console.log(action.payload);
            const payload = action.payload; 
            payload.forEach((item) => {
                state.menuData[item.name] = item.items;
               
            });  
        },
        addToCart(state, action) {
            const itemName = action.payload.item.name;
            const itemPrice = action.payload.item.price;
            const itemThubnail =action.payload.item.thumbnail
            // console.log(itemThubnail)
            if (state.cartData[itemName]) {
        
                state.cartData[itemName].quantity++;
            } else {

                state.cartData[itemName] = {
                    quantity: 1,
                    price: itemPrice,
                    thumbnail:itemThubnail
                };
            }
        },
        removeFromCart(state, action) {
            const itemName = action.payload.item.name;

            if (state.cartData[itemName]) {
                if (state.cartData[itemName].quantity > 1) {
                   
                    state.cartData[itemName].quantity--;
                } else {
                    
                    delete state.cartData[itemName];
                }
            }
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const { setData, addToCart, removeFromCart, setLoading } = customerSlice.actions;
export default customerSlice.reducer;