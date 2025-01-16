
import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"

import  {apiConnector}  from "../apiconnector"
import {ProductEndpoints} from "../apis"
import { setProducts } from "../../redux/slices/appdata"

const {
CREATE_PRODUCT_API,
GET_ALL_PRODUCTS_API
} = ProductEndpoints

export function createProduct(token,data) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        // console.log(data)

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("salesPrice", data.salesPrice);
        formData.append("mrp", data.mrp);
        formData.append("packageSize", data.packageSize);
        formData.append("tags", JSON.stringify(data.tags)); // Make sure this is a stringified array
        formData.append("categoryId", data.categoryId);
        formData.append("sell", data.sell);
        
        // Append images (this can be an array of files)
        data.images.forEach(image => formData.append("images", image));
        
        try {
            const response = await apiConnector("POST", CREATE_PRODUCT_API, formData, {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            });

            console.log("CREATE PRODUCT API RESPONSE............", response.data)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
        } catch (error) {
            console.log("GET ALL TAGS API ERROR............", error)
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}
// Middleware to fetch products
export function getAllProducts(page, limit = 10) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading products...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "GET",
        `${GET_ALL_PRODUCTS_API}?page=${page}&limit=${limit}`
      );

      console.log("GET ALL PRODUCTS RESPONSE............", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Dispatch the products and pagination details to the store
      dispatch(
        setProducts({
          products: response.data.products,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
        })
      );
    } catch (error) {
      console.log("GET ALL PRODUCTS ERROR............", error);
      toast.error(error.message || "Failed to fetch products.");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
