import {combineReducers} from '@reduxjs/toolkit'

import cart from './slices/cart'
import auth from './slices/auth.jsx'
import appdata from './slices/appdata.jsx'

const rootReducer = combineReducers({
    cart:cart,
    auth:auth,
    appdata:appdata
})

export default rootReducer