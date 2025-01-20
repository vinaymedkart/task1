
import { toast } from "react-hot-toast"
import { setLoading } from "../../redux/slices/auth"

import {addTag, setTag} from "../../redux/slices/appdata"
import  {apiConnector}  from "../apiconnector"
import {TagEndpoints} from "../apis"

const {
    CREATE_TAG_API,
    GET_ALL_TAGS_API
} = TagEndpoints


export function createTag(token, data) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      
      console.log(data)
  
      try {
        const response = await apiConnector("POST", CREATE_TAG_API, data, {
          Authorization: `Bearer ${token}`,
        });
  
        console.log("CREATE TAG API RESPONSE............", response.data)
        dispatch(addTag(data))
        // window.location.reload();
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.log("CREATE TAGS API ERROR............", error)
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
  

export function getAllTags(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
     
        try {
            const response = await apiConnector("GET", GET_ALL_TAGS_API, null,{
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,  
            });

            console.log("GET ALL TAG API RESPONSE............", response.data.tags)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            dispatch(setTag(response.data.tags))
           
            
            // navigate("/dashboard")
        } catch (error) {
            console.log("GET ALL TAGS API ERROR............", error)
            
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}
