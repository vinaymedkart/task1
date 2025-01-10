const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

// OWNER ENDPOINTS
export const endpoints = {
  SENDOTP_API:        BASE_URL + "/auth/sendotp",
  SIGNUP_API:         BASE_URL + "/auth/signup",
  LOGIN_API:          BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API:  BASE_URL + "/auth/reset-password",
}




// CUSTOMER ENDPOINTS
export const customerEndpoints = {
  
}