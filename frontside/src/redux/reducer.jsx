import {combineReducers} from '@reduxjs/toolkit'

import cart from './slices/cart'
import auth from './slices/auth.jsx'


const rootReducer = combineReducers({
    cart:cart,
    auth:auth
})

export default rootReducer