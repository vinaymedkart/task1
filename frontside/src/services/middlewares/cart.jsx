import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"
import { apiConnector } from "../apiconnector"
import { CartEndpoints } from "../apis"
// import { setCartItems } from "../../redux/slices/appdata" 

const { ADD_TO_CART_API, GET_CART_ITEMS_API,REMOVE_CART_ITEM_API } = CartEndpoints

export function addToCart(token, cartItems) {
    return async (dispatch) => {
        const toastId = toast.loading("Adding items to cart...")
        dispatch(setLoading(true))
        try {
          // Transform localStorage cart data to match backend expectations
          const cartData = Object.entries(cartItems).map(([productId, quantity]) => ({
            productId,
            quantity
          }));
         

            const response = await apiConnector("POST", ADD_TO_CART_API, 
                { items: cartData },
                {
                    Authorization: `Bearer ${token}`,
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            // toast.success("Items added to cart successfully");
            return response.data;

        } catch (error) {
            console.log("ADD TO CART API ERROR............", error)
            toast.error(error.message || "Failed to add items to cart");
        } finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }
    }
}
export function getAllCartProducts(token) {
  return async (dispatch) => {
      const toastId = toast.loading("Loading cart items...")
      dispatch(setLoading(true))

      try {
          const response = await apiConnector("GET", GET_CART_ITEMS_API, null, {
              Authorization: `Bearer ${token}`,
          });

          if (!response.data.success) {
              throw new Error(response.data.message)
          }

          // dispatch(setCartItems(response.data.cartItems));
          return response.data;

      } catch (error) {
          console.log("GET CART ITEMS API ERROR............", error)
          toast.error(error.message || "Failed to fetch cart items");
      } finally {
          dispatch(setLoading(false))
          toast.dismiss(toastId)
      }
  }
}

export function removeFromCart(token, productId) {
    return async (dispatch) => {
        const toastId = toast.loading("Removing item from cart...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector(
                "DELETE", 
                `${REMOVE_CART_ITEM_API}/${productId}`,
                null,
                {
                    Authorization: `Bearer ${token}`,
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Item removed from cart");
            return response.data;

        } catch (error) {
            console.log("REMOVE FROM CART API ERROR............", error)
            toast.error(error.message || "Failed to remove item from cart");
            throw error;
        } finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }
    }
}

