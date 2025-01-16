const BASE_URL ="http://localhost:8000/api/v1"


// AUTH ENDPOINTS
export const AuthEndpoints = {
  SIGNUP_API:         BASE_URL + "/auth/signup",
  LOGIN_API:          BASE_URL + "/auth/login",
}
// TAG ENDPOINTS
export const TagEndpoints = {
  GET_ALL_TAGS_API: BASE_URL+"/tag/getAll",
}

// CATEGORY ENDPOINTS
export const CategoryEndpoints = {
  GET_ALL_CATEGORYS_API: BASE_URL+"/category/getAll",
}
// PRODUCT ENDPOINTS
export const ProductEndpoints = {
  CREATE_PRODUCT_API: BASE_URL+"/product/create",
  GET_ALL_PRODUCTS_API: BASE_URL+`/product/getAllProducts`
}