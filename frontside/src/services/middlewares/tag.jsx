
import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"

import {setTag} from "../../redux/slices/appdata"
import  {apiConnector}  from "../apiconnector"
import {TagEndpoints} from "../apis"

const {
    GET_ALL_TAGS_API,
} = TagEndpoints

export function getAllTags(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
     
        try {
            const response = await apiConnector("GET", GET_ALL_TAGS_API, null,{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,  
            });

            console.log("GET ALL TAG API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setTag(response.data))
           
            localStorage.setItem("Tags", response.data)  
            
            // navigate("/dashboard")
        } catch (error) {
            console.log("GET ALL TAGS API ERROR............", error)
            
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}
