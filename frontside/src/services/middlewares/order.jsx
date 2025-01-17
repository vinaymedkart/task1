import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"
import { apiConnector } from "../apiconnector"
import { OrderEndpoints } from "../apis"
 

const { PLACE_ORDER_API,GET_ORDER_HISTORY_API,UPDATE_ORDER_STATUS_API,GET_ALL_ORDERS_API } = OrderEndpoints

export function placeOrder(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Adding items to cart...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", PLACE_ORDER_API, {},
                {
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${token}`,
                }
            );
            console.log(response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Order placed Successfully");
            window.location.reload();
            return response.data;

        } catch (error) {
            console.log("ERROR in placing Order ............", error)
            toast.error(error.message || "Failed to place order");
        } finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }
    }
}

export function historyOrders(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Orders to cart...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("GET", GET_ORDER_HISTORY_API, {},
                {
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${token}`,
                }
            );
            console.log(response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Order history");
            return response.data;

        } catch (error) {
            console.log("ERROR in fetching Order history ............", error)
            toast.error(error.message || "Failed to place order");
        } finally {
            dispatch(setLoading(false))
            toast.dismiss(toastId)
        }
    }
}

export function updateOrderStatus(orderId, status, token) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating order status...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_ORDER_STATUS_API,
                { status,orderId },
                {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Order status updated successfully");
            return response.data;

        } catch (error) {
            console.log("ERROR in updating order status:", error);
            toast.error(error.message || "Failed to update order status");
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

export function allOrders(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating order status...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET",GET_ALL_ORDERS_API,{},
                {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            console.log(response)
            toast.success("Pending Orders");
            return response.data;

        } catch (error) {
            console.log("ERROR in geting all pending orders:", error);
            toast.error(error.message || "Failed to update order status");
            return false;

        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}