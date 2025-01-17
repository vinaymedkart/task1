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
  GET_ALL_PRODUCTS_API: BASE_URL+`/product/getAll`,
  EDIT_PRODUCT_API:BASE_URL+`/product/edit`,
  DELETE_PRODUCT_API:BASE_URL+`/product/delete`
}
// CART ENDPOINTS
export const CartEndpoints = {
  ADD_TO_CART_API: BASE_URL+"/cartItem/add",
  GET_CART_ITEMS_API: BASE_URL+"/cartItem/items",
  UPDATE_CART_ITEM_API: BASE_URL+"/cartItem/update",
  REMOVE_CART_ITEM_API: BASE_URL+"/cartItem/remove",
}

// ORDER ENDPOINTS
export const OrderEndpoints = {
  PLACE_ORDER_API: BASE_URL+"/order/place",
  GET_ORDER_HISTORY_API: BASE_URL+"/order/history",
  UPDATE_ORDER_STATUS_API: BASE_URL+"/order/status",
  GET_ALL_ORDERS_API:BASE_URL+"/order/getAll"
}

