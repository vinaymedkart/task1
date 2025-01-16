
import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"

import  {apiConnector}  from "../apiconnector"
import {CartEndpoints} from "../apis"
import { setProducts } from "../../redux/slices/appdata"

const {
ADD_TO_CART_API

} = CartEndpoints

export function addToCart(token,data) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        // console.log(data)

        try {
            const response = await apiConnector("POST", ADD_TO_CART_API, data, {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            });

            console.log("ADD PRODUCT TO CART API RESPONSE............", response.data)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
        } catch (error) {
            console.log("GET ALL CART ITEMS API ERROR............", error)
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function getAllCartProducts(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading cart products...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("GET",'');

      console.log("GET ALL CART PRODUCTS RESPONSE............", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Dispatch the products and pagination details to the store
     
    } catch (error) {
      console.log("GET ALL CART PRODUCTS ERROR............", error);
      toast.error(error.message || "Failed to fetch products.");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
