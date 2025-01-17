
import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"

import { apiConnector } from "../apiconnector"
import { ProductEndpoints } from "../apis"
import { setProducts, updateProduct } from "../../redux/slices/appdata"

const {
  CREATE_PRODUCT_API,
  GET_ALL_PRODUCTS_API,
  EDIT_PRODUCT_API,
  DELETE_PRODUCT_API,
  
} = ProductEndpoints

export function createProduct(token, data) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    console.log(data)

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("salesPrice", data.salesPrice);
    formData.append("mrp", data.mrp);
    formData.append("packageSize", data.packageSize);
    formData.append("tags", JSON.stringify(data.tags)); // Make sure this is a stringified array
    formData.append("categoryId", data.categoryId);
    formData.append("sell", data.sell);
    formData.append("stock", data.stock);
    

    // Append images (this can be an array of files)
    data.images.forEach(image => formData.append("images", image));

    try {
      const response = await apiConnector("POST", CREATE_PRODUCT_API, formData, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });

      console.log("CREATE PRODUCT API RESPONSE............", response.data)
      // dispatch()
      window.location.reload();
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
export function getAllProducts( token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading products...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "GET",
        `${GET_ALL_PRODUCTS_API}`,
        {},
        {
          Authorization: `Bearer ${token}`,
        }

      );

      console.log("GET ALL PRODUCTS RESPONSE............", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

     
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

export function editProducts(token, data,) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating product...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "PUT",
        EDIT_PRODUCT_API,
        data,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("EDIT PRODUCTS RESPONSE............", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Update the single product in the store
      dispatch(updateProduct(response.data.product));
      
      toast.success("Product updated successfully");
    } catch (error) {
      console.log("EDIT PRODUCT ERROR............", error);
      toast.error(error.message || "Failed to update product");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}


export function deleteProduct(token, productId) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating product...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "PUT",
        DELETE_PRODUCT_API,
        {productId},
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("DELETE PRODUCTS RESPONSE............", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
   window.location.reload();
      // Update the single product in the store
      // dispatch(removeProduct(response.data.productId));
      
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log("DELETE PRODUCT ERROR............", error);
      toast.error(error.message || "Failed to DELETE product");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}