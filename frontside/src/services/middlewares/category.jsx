
import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"

import {addCategory, setCategory} from "../../redux/slices/appdata"
import  {apiConnector}  from "../apiconnector"
import {CategoryEndpoints} from "../apis"

const {
    CREATE_CATEGORY_API,
    GET_ALL_CATEGORYS_API,
} = CategoryEndpoints



export function createCategory(token, data) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      
      console.log(data)
  
      try {
        const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
          Authorization: `Bearer ${token}`,
        });
  
        console.log("CREATE CATEGORY API RESPONSE............", response.data)
        dispatch(addCategory(data))
        // window.location.reload();
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.log("CREATE CATEGORY API ERROR............", error)
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }

export function getAllCategorys(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        // console.log(token)
        try {
            const response = await apiConnector("GET", GET_ALL_CATEGORYS_API, null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`  
            });

            console.log("GET ALL CATEGORY API RESPONSE............", response.data.categorys)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
        
            dispatch(setCategory(response.data.categorys))
           
            
            
            // navigate("/dashboard")
        } catch (error) {
            console.log("GET ALL categorys API ERROR............", error)
            
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}
