
import { toast } from "react-hot-toast"
import { setData, setLoading, setToken } from "../../redux/slices/auth"
import  {apiConnector}  from "../apiconnector"
import { AuthEndpoints } from "../apis"

const {
    SIGNUP_API,
    LOGIN_API,
} = AuthEndpoints

export function signUp(signupData,  navigate) {

    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        console.log(signupData)
        try {
            const {
                firstName,
                lastName,
                email,  
                password,
                confirmPassword,
            } = signupData

            const response = await apiConnector("POST", SIGNUP_API, {
                firstName,
                lastName,
                email,  
                password,
                confirmPassword,
                role:"USER"
            })

            console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login")
        } catch (error) {
            console.log("SIGNUP API ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password
            });
            console.log("LOGIN API RESPONSE............", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Login Successful");
            dispatch(setToken(response.data.token));
            dispatch(setData(response.data.verifyData));

     
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("data", response.data.verifyData);  // Make sure to store it as a JSON string
            

            navigate("/");  // Redirect to home or another page
        } catch (error) {
            console.log("LOGIN API ERROR............", error);
            toast.error("Login Failed");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}
