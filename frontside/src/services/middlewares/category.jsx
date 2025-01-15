
import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"

import {setCategory} from "../../redux/slices/appdata"
import  {apiConnector}  from "../apiconnector"
import {CategoryEndpoints} from "../apis"

const {
    GET_ALL_CATEGORYS_API,
} = CategoryEndpoints

export function getAllCategorys(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
     
        try {
            const response = await apiConnector("GET", GET_ALL_CATEGORYS_API, null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`  
            });

            console.log("GET ALL CATEGORY API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setCategory(response.data))
           
            localStorage.setItem("categorys", response.data)  
            
            // navigate("/dashboard")
        } catch (error) {
            console.log("GET ALL categoryS API ERROR............", error)
            
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}
