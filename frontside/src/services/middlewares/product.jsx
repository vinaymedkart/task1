
import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"

import { apiConnector } from "../apiconnector"
import { ProductEndpoints } from "../apis"
import { addProduct, setProducts, updateProduct ,delProduct, setTag, setCategory} from "../../redux/slices/appdata"

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
    
    
    data.tags=JSON.stringify(data.tags)
    data.images=JSON.stringify(data.images)
    // console.log(token)
    // console.log(data)

    try {
      const response = await apiConnector("POST", CREATE_PRODUCT_API, data, {
        Authorization: `Bearer ${token}`,
      });

      console.log("CREATE PRODUCT API RESPONSE............", response.data)
      console.log();
      dispatch(addProduct(response.data.product))
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

// export function getAllProducts(token, page = 1, query = {}) {
//   return async (dispatch) => {
//     const toastId = toast.loading("Loading products...");
//     dispatch(setLoading(true));
//     try {
//       // Convert arrays to comma-separated strings for query params
//       const queryParams = new URLSearchParams({
//         page: page,
//         searchbar: query.searchbar || "",
//         tags: query.tags?.join(',') || "",
//         categorys: query.categories?.join(',') || "" // Note: API expects 'categorys'
//       });
//       console.log(query)

//       const response = await apiConnector(
//         "GET",
//         `${GET_ALL_PRODUCTS_API}?${queryParams.toString()}`,
//         null, // No body needed for GET request
//         {
//           Authorization: `Bearer ${token}`,
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       dispatch(
//         setProducts({
//           products: response.data.products,
//           currentPage: response.data.currentPage,
//           totalPages: response.data.totalPages,
//         })
//       );
//     } catch (error) {
//       console.error("GET ALL PRODUCTS ERROR............", error);
//       toast.error(error.message || "Failed to fetch products.");
//     }

//     dispatch(setLoading(false));
//     toast.dismiss(toastId);
//   };
// }
export function getAllProducts(token, page = 1, query = {}) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading products...");
    dispatch(setLoading(true));
    try {
      // Convert arrays to comma-separated strings for query params
      
      console.log(query)

      const response = await apiConnector(
        "POST",
        `${GET_ALL_PRODUCTS_API}?page=${page}`,
        query,
        {
          Authorization: `Bearer ${token}`,
        }
      );

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
      dispatch(setTag(response.data.tags));
      dispatch(setCategory(response.data.categorys));
      
    } catch (error) {
      console.error("GET ALL PRODUCTS ERROR............", error);
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
    window.location.reload();

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
      dispatch(delProduct(response.data.productId))
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